import os
import json
import traceback
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from unstructured.partition.pdf import partition_pdf
from supabase import create_client
import google.generativeai as genai
import warnings

# === Load env vars ===
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("API_KEY")

# === Setup ===
app = Flask(__name__)
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# === Embedding generator ===
def get_embedding(text):
    response = genai.embed_content(
        model="models/embedding-001",
        content=text
    )
    return response.get("embedding", [])

# === Store content and embeddings ===
def store_content_and_embeddings(file_path):
    elements = partition_pdf(
    filename=file_path,
    chunking_strategy="by_title",
    infer_table_strategy=True,
    max_characters=1000,
    new_after_n_chars=1500,
    combine_text_under_n_chars=250,
    strategy="hi_res"
)
    for el in elements:
        content = str(el).strip()
        if content:
            embedding = get_embedding(content)
            if embedding:
                supabase.table("content").insert({
                    "content": content,
                    "embedding": json.dumps(embedding)
                }).execute()

# === Fetch existing context ===
def fetch_relevant_content():
    response = supabase.table("content").select("content").execute()
    return [item["content"] for item in response.data] if response.data else []

def make_prompt(query, context):
    return f"Based on the following information, answer the question:\n\n{context}\n\nQuestion: {query}"

# === Routes ===
@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        filename = secure_filename(file.filename)
        file_path = f"./tmp_{filename}"
        file.save(file_path)

        store_content_and_embeddings(file_path)

        return jsonify({"message": "✅ Content and embeddings uploaded successfully!"})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route('/query', methods=['POST'])
def ask_question():
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"error": "Missing 'query' in request body"}), 400

        user_query = data['query']
        query=data['query']
        existing = supabase.table("Answers").select("*").eq("query", query).execute()
        if existing.data:
            return jsonify({
                "msg": "Answer already exists",
                "answer": existing.data[0]["answers"]
            }), 200
            
        supabase.table("Answers").insert({"query": user_query}).execute()
        context_data = fetch_relevant_content()
        context_text = "\n".join(context_data)
        

        warnings.filterwarnings("ignore")
        response = model.generate_content(make_prompt(user_query, context_text))
        answers_text=response.text.strip()
        supabase.table("Answers").insert({"query":user_query,"answers":answers_text}).execute()

        return jsonify({"answer": response.text})


    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# === Main ===
if __name__ == "__main__":
    app.run(debug=True)
