import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { supabase } from "./supabase";

// Function to generate embeddings using Google Generative AI
export async function getEmbedding(text) {
  try {
    const model = google.textEmbeddingModel("text-embedding-004"); // Use the embedding model from the SDK
    const embeddingResult = await model.embedText(text); // Use embedText to generate the embedding

    return embeddingResult?.embedding?.values || null;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

// Function to create a prompt with context
function makePrompt(query, context) {
  return `Based on the following information, answer the question: ${context} Question: ${query} Answer the question based only on the provided information. If you don't know the answer, say "I don't have enough information to answer this question."`;
}

// Function to fetch relevant context from previous messages
export async function fetchRelevantContent(groupId) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("content")
      .eq("group_id", groupId)
      .order("timestamp", { ascending: false })
      .limit(20); // Get the 20 most recent messages

    if (error) throw error;

    return data ? data.map((item) => item.content).join("\n\n") : "";
  } catch (error) {
    console.error("Error fetching relevant content:", error);
    return "";
  }
}

// Function to check if teacher is available
export async function isTeacherAvailable(groupId) {
  try {
    // First get the teacher_id for this group
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select("teacher_id")
      .eq("id", groupId)
      .single();

    if (groupError) throw groupError;

    // Then check if the teacher is available
    const { data: teacherData, error: teacherError } = await supabase
      .from("teachers")
      .select("is_available")
      .eq("id", groupData.teacher_id)
      .single();

    if (teacherError) throw teacherError;

    return teacherData.is_available;
  } catch (error) {
    console.error("Error checking teacher availability:", error);
    return true; // Default to available if there's an error
  }
}

// Function to generate AI response using Gemini
export async function generateAIResponse(query, groupId, userId) {
  try {
    // Check if an answer already exists
    const { data: existingAnswers } = await supabase
      .from("answers")
      .select("answers")
      .eq("query", query)
      .single();

    if (existingAnswers) {
      return existingAnswers.answers;
    }

    // Check if teacher is available
    const teacherAvailable = await isTeacherAvailable(groupId);

    if (teacherAvailable) {
      // If teacher is available, don't generate AI response
      return null;
    }

    // Fetch context for the AI
    const context = await fetchRelevantContent(groupId);

    // Generate the prompt
    const prompt = makePrompt(query, context);

    // Generate AI response using Gemini
    const model = google("gemini-1.5-pro-latest"); // Get the language model from the SDK

    const { text: aiResponse } = await generateText({
      model: model,
      prompt: prompt,
    });

    // Generate embedding for the response
    const embedding = await getEmbedding(aiResponse);

    // Save the AI response to the messages table
    const { error: messageError } = await supabase.from("messages").insert({
      group_id: groupId,
      sender_id: userId, // Using the user's ID but with AI role
      sender_role: "ai",
      content: aiResponse,
      embedding: embedding,
    });

    if (messageError) throw messageError;

    // Also save to answers table for future reference
    const { error: answerError } = await supabase.from("answers").insert({
      query: query,
      answers: aiResponse,
    });

    if (answerError) throw answerError;

    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}
