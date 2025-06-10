import UserAvatar from "@/components/user-avatar";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/libs/utils";
import { NavLink } from "react-router";

const ChatListItem = ({ conv, isRequest = false }) => {
  const { messages } = useChat(conv.id);
  const recentMessage = messages?.[messages.length - 1];

  return (
    <NavLink
      to={`/messages/${isRequest ? "requests/" : ""}${conv.id}`}
      key={conv.id}
      className={({ isActive }) =>
        cn(
          "p-4 flex gap-4 hover:bg-neutral-50",
          isActive && "bg-neutral-200/50 hover:bg-neutral-200/50"
        )
      }
    >
      <UserAvatar name={conv.title} avatar={conv.avatarUrl} />
      <div className="flex flex-col justify-center">
        <div className="text-neutral-700 text-[15px] font-medium leading-5">{conv.title}</div>
        <div className="text-neutral-500 text-sm leading-5">{recentMessage?.message.content}</div>
      </div>
    </NavLink>
  );
};

export default ChatListItem;
