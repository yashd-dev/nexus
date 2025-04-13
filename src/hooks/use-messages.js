"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

export function useMessages(groupId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!groupId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(`
            id,
            content,
            timestamp,
            sender_id,
            sender_role,
            group_id
          `)
          .eq("group_id", groupId)
          .order("timestamp", { ascending: true })

        if (error) throw error

        const messagesWithUserData = await Promise.all(
          data.map(async (message) => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("name")
              .eq("id", message.sender_id)
              .single()

            if (userError) {
              console.error("Error fetching user data:", userError)
              return {
                ...message,
                sender_name: "Unknown User",
                sender_avatar: "/placeholder.svg?height=40&width=40",
              }
            }

            return {
              ...message,
              sender_name: userData.name,
              sender_avatar: "/placeholder.svg?height=40&width=40",
            }
          }),
        )

        setMessages(messagesWithUserData)
      } catch (err) {
        console.error("Error fetching messages:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel(`messages:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("name")
            .eq("id", payload.new.sender_id)
            .single()

          const newMessage = {
            ...payload.new,
            sender_name: userError ? "Unknown User" : userData.name,
            sender_avatar: "/placeholder.svg?height=40&width=40",
          }

          setMessages((prev) => [...prev, newMessage])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId])

  const sendMessage = async (content) => {
    if (!user || !groupId || !content.trim()) {
      return { success: false, error: "Missing required data" }
    }

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          group_id: groupId,
          sender_id: user.id,
          sender_role: user.role,
          content,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, message: data }
    } catch (err) {
      console.error("Error sending message:", err)
      return { success: false, error: err.message }
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
  }
}