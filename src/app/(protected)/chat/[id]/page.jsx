import ChatLayout from "@/components/sections/chat/chat-layout";

export default async function GroupChat({ params }) {
  const { id } = await params;
  return (
    <>
      <ChatLayout groupId={id} />
    </>
  );
}
