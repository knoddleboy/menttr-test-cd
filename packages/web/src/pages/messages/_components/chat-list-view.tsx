import { useUserConversations } from "@/services/messages/user-conversations";
import ChatListItem from "./chat-list-item";
import PageLoading from "@/components/page-loading";
import ChatRequestsListItem from "./chat-requests-list-item";
import { TabsEmpty } from "@/components/ui/tabs";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const ChatListView = () => {
  const { data, isPending } = useUserConversations();

  if (isPending) {
    return <PageLoading />;
  }

  if (!data) {
    return null;
  }

  const { conversations, pendingRequestsCount } = data;

  return (
    <>
      {pendingRequestsCount > 0 && (
        <ChatRequestsListItem pendingRequestsCount={pendingRequestsCount} />
      )}

      {conversations.length ? (
        conversations.map((conv) => <ChatListItem key={conv.id} conv={conv} />)
      ) : (
        <div className="h-full flex flex-col justify-center items-center gap-3">
          <div className="text-[15px] text-neutral-700 font-semibold">No conversations yet</div>
          <Button variant="primary" asChild>
            <Link to="/">Browse mentors</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default ChatListView;
