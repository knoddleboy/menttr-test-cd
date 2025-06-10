import { useParams } from "react-router";
import ChatView from "@/components/chat/chat-view";
import { TabsEmpty } from "@/components/ui/tabs";

type Props = {
  convId?: number;
};

const Chat = (props: Props) => {
  const params = useParams();
  const convId = props.convId ?? params.convId;

  if (!convId) {
    return <TabsEmpty title="No chat selected" subtitle="Pick a chat to start messaging" />;
  }

  return <ChatView chatId={+convId} />;
};

export default Chat;

// import PageLoading from "@/components/page-loading";
// import { TabsEmpty } from "@/components/ui/tabs";
// import socketService from "@/libs/socket";
// import { useConversation } from "@/services/messages/conversation";
// import { useUser } from "@/services/user";
// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router";
// import PendingConversationStatus from "../_flows/pending-conversation-status";
// import ChatHeader from "@/components/chat/chat-header";
// import ChatMessageList from "@/components/chat/chat-message-list";
// import ChatInput from "@/components/chat/chat-input";

// type Props = {
//   convId?: number;
// };

// const Chat = (props: Props) => {
//   const params = useParams();

//   const convId = props.convId ?? params.convId;

//   const { user } = useUser();
//   const { data: conversation, isPending, refetch } = useConversation(convId ? +convId : null);

//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);

//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!convId) return;

//     socketService.connect();

//     socketService.on(`conversations/${convId}`, (message) => {
//       setMessages((prev) => {
//         const exists = prev.some((m) => m.message.id === message.message.id);
//         return exists ? prev : [...prev, message];
//       });
//     });

//     return () => {
//       socketService.disconnect();
//     };
//   }, [convId]);

//   useEffect(() => {
//     if (conversation) {
//       setMessages(conversation.messages);
//     }
//   }, [conversation]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (!convId || !input.trim()) return;

//     socketService.sendMessage("sendMessage", {
//       conversationId: +convId,
//       content: input,
//     });

//     setInput("");
//   };

//   if (!convId) {
//     return (
//       <div className="h-full flex justify-center items-center">
//         <TabsEmpty title="No message selected" subtitle="Select a message to see it here" />
//       </div>
//     );
//   }

//   if (isPending) {
//     return <PageLoading />;
//   }

//   if (!user || !conversation) {
//     return null;
//   }

//   const otherUser = conversation.participants.filter((p) => p.userId !== user.id)[0].user;
//   const isPendingConv = conversation.participants.some(
//     (p) => p.userId === user.id && p.status === "pending"
//   );
//   const isRejectedConv = conversation.participants.some(
//     (p) => p.userId === user.id && p.status === "rejected"
//   );

//   return (
//     <div className="flex-1 flex flex-col overflow-x-hidden">
//       <ChatHeader
//         title={conversation.title}
//         avatarUrl={conversation.avatarUrl}
//         linkTo={`/${otherUser.username}`}
//       />

//       <ChatMessageList messages={messages} currentUser={user} />

//       <div className="px-4 py-3 border-t border-neutral-200">
//         {isRejectedConv ? (
//           <div className="text-neutral-700 text-[15px] font-medium text-center">
//             You rejected this request.
//           </div>
//         ) : isPendingConv && conversation.isDirect ? (
//           <PendingConversationStatus
//             convId={+convId}
//             initiatorName={otherUser.name}
//             onAccept={refetch}
//           />
//         ) : (
//           <ChatInput
//             input={input}
//             onChange={(value) => setInput(value)}
//             onSendMessage={sendMessage}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;
