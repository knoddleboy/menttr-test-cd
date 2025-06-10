import socketService from "@/libs/socket";
import { useConversation } from "@/services/messages/conversation";
import { useUser } from "@/services/user";
import { useEffect, useState } from "react";

export const useChat = (chatId: number) => {
  const { user } = useUser();
  const { data: chatData, isPending, refetch } = useConversation(chatId);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (chatData) setMessages(chatData.messages);
  }, [chatData]);

  useEffect(() => {
    socketService.connect();
    socketService.on(`conversations/${chatId}`, (message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.message.id === message.message.id);
        return exists ? prev : [...prev, message];
      });
    });

    return () => {
      socketService.disconnect();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socketService.sendMessage("sendMessage", {
      conversationId: chatId,
      content: input,
    });
    setInput("");
  };

  return {
    user,
    chatData,
    isPending,
    messages,
    input,
    setInput,
    sendMessage,
    refetch,
  };
};
