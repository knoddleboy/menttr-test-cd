import GoBackButton from "@/components/go-back-button";
import { usePendingConversations } from "@/services/messages/pending-conversations";
import ChatListItem from "./chat-list-item";
import PageLoading from "@/components/page-loading";

const ChatRequestsListView = () => {
  const { data, isPending } = usePendingConversations();

  if (isPending) {
    return <PageLoading />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="p-4 border-b border-neutral-200">
        <GoBackButton navigateTo="/messages" />
      </div>

      <div>
        {data.map((conv) => (
          <ChatListItem key={conv.id} conv={conv} isRequest />
        ))}
      </div>
    </>
  );
};

export default ChatRequestsListView;
