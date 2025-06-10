import ChatInput from "@/components/chat/chat-input";
import ChatMessageList from "@/components/chat/chat-message-list";
import PageLoading from "@/components/page-loading";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/use-chat";
import { FaCompressAlt, FaExpandAlt } from "react-icons/fa";

type Props = {
  chatId: number;
  isExpanded?: boolean;
  onExpandClick?: () => void;
};

const ProgramChatView = ({ chatId, isExpanded = false, onExpandClick }: Props) => {
  const { user, chatData, isPending, messages, input, setInput, sendMessage } = useChat(chatId);

  if (isPending) {
    return <PageLoading />;
  }

  if (!chatData || !user) {
    return null;
  }

  return (
    <div className="flex-2 flex flex-col overflow-x-hidden">
      <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-200 text-neutral-700 text-lg font-semibold">
        Chat
        <Button variant="secondary" className="size-8" onClick={onExpandClick}>
          {isExpanded ? <FaCompressAlt className="size-4" /> : <FaExpandAlt className="size-4" />}
        </Button>
      </div>

      {messages.length ? (
        <ChatMessageList messages={messages} currentUser={user} displayUser />
      ) : (
        <div className="flex-1 flex justify-center items-center text-neutral-500 text-[13px] font-medium">
          No messages yet
        </div>
      )}

      <div className="px-4 py-3 border-t border-neutral-200">
        <ChatInput
          input={input}
          onChange={(value) => setInput(value)}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ProgramChatView;
