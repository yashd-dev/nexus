import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  generateAIResponse,
  getEmbedding,
  isTeacherAvailable,
} from "@/lib/ai-utils";

export async function POST(request) {
  try {
    const { content, groupId, userId, senderRole } = await request.json();

    if (!content || !groupId || !userId || !senderRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate embedding for the message
    const embedding = await getEmbedding(content);

    // Insert the user's message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        group_id: groupId,
        sender_id: userId,
        sender_role: senderRole,
        content,
        embedding,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Check if teacher is available
    const teacherAvailable = await isTeacherAvailable(groupId);

    // If teacher is not available, generate AI response
    let aiResponse = null;
    if (!teacherAvailable) {
      aiResponse = await generateAIResponse(content, groupId, userId);
    }

    return NextResponse.json({
      message,
      aiResponse,
      teacherAvailable,
    });
  } catch (error) {
    console.error("Error in message API:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
