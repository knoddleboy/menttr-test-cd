import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessageList from "./chat-message-list";
import PageLoading from "../page-loading";
import { useChat } from "@/hooks/use-chat";
import PendingConversationStatus from "@/pages/messages/_flows/pending-conversation-status";

type Props = {
  chatId: number;
};

const ChatView = ({ chatId }: Props) => {
  const { user, chatData, isPending, messages, input, setInput, sendMessage, refetch } =
    useChat(chatId);

  if (isPending) return <PageLoading />;
  if (!chatData || !user) return null;

  const initiator = chatData.participants.filter((p) => p.userId !== user.id)[0];
  const isPendingRequest = chatData.participants.some(
    (p) => p.userId === user.id && p.status === "pending"
  );

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      <ChatHeader title={chatData.title} avatarUrl={chatData.avatarUrl} linkTo={`/`} />

      <ChatMessageList messages={messages} currentUser={user} />

      <div className="px-4 py-3 border-t border-neutral-200">
        {isPendingRequest && chatData.isDirect ? (
          <PendingConversationStatus
            convId={chatId}
            initiatorName={initiator.user.name}
            onAccept={refetch}
          />
        ) : (
          <ChatInput
            input={input}
            onChange={(value) => setInput(value)}
            onSendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default ChatView;
