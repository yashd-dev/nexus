import google.generativeai as genai
import os
import json
import numpy as np
from supabase import create_client
from unstructured.partition.pdf import partition_pdf
import warnings
from dotenv import load_dotenv
load_dotenv()

# Load API keys
genai.configure(api_key=os.getenv("API_KEY"))
supabase_client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Model 
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def check_if_data_exists():
    """Check if the Supabase content table already has data."""
    response = supabase_client.table("content").select("content").execute()
    return bool(response.data)  # Returns True if data exists, False otherwise

def process_and_store_pdf(pdf_file_name):
    """Process PDF and store embeddings in Supabase if table is empty."""
    if check_if_data_exists():
        print("✅ Data already exists in Supabase. Skipping PDF processing.")
        return

    print("🔄 Processing PDF and storing data in Supabase...")
    elements = partition_pdf(filename=pdf_file_name, strategy="hi_res")

    texts, tables = [], []
    for el in elements:
        if "Table" in str(type(el)):
            tables.append(str(el))
        elif "CompositeElement" in str(type(el)):
            texts.append(str(el))

    def get_embedding(text):
        """Generates embeddings using Google Gemini API."""
        response = genai.embed_content(model="models/embedding-001", content=text)
        return response.get("embedding", [])

    for content in texts + tables:
        embedding = get_embedding(content)
        if embedding:  # Ensure embedding is not empty
            supabase_client.table("content").insert({
                "content": content,
                "embedding": json.dumps(embedding)  # Convert to JSON
            }).execute()

    print("✅ Embeddings stored successfully in Supabase!")

def fetch_relevant_content():
    """Fetch all relevant content from Supabase."""
    response = supabase_client.table("content").select("content").execute()
    return [item["content"] for item in response.data] if response.data else []

def make_prompt(query, context):
    """Create a prompt using the fetched content."""
    return f"Based on the following information, answer the question:\n\n{context}\n\nQuestion: {query}"

# --- Main Execution ---
pdf_file_name = "nexus/backend/m2.pdf"
process_and_store_pdf(pdf_file_name)  # Only processes if data doesn't exist

# User query
user_query = "who is sameed arif"

# Fetch existing data from Supabase
context_data = fetch_relevant_content()
context_text = "\n".join(context_data)  # Combine fetched texts

warnings.filterwarnings("ignore")
# Generate response from Gemini
response = model.generate_content(make_prompt(user_query, context_text))
print(response.text)
