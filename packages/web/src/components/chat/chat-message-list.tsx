import { cn, formatRelativeDate } from "@/libs/utils";
import { differenceInMinutes } from "date-fns";
import { useEffect, useRef } from "react";
import UserAvatar from "../user-avatar";

type Props = {
  messages: any[];
  currentUser: any;
  displayUser?: boolean;
};

const ChatMessageList = ({ messages, currentUser, displayUser = false }: Props) => {
  const messageListEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageListEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  return (
    <>
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {groupMessages(messages).map((group, index) => {
          const isMe = group.sender.id === currentUser.id;

          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="flex flex-col gap-1 max-w-96">
                {group.messages.map(({ message }, idx) => {
                  const isLast = idx === group.messages.length - 1;

                  return (
                    <div
                      key={message.id}
                      className={cn("flex items-end gap-2", isMe && "justify-end")}
                    >
                      {displayUser && !isMe && isLast && (
                        <UserAvatar
                          name={group.sender.name}
                          avatar={group.sender.profileImageUrl}
                          className="size-9"
                        />
                      )}
                      <div
                        key={message.id}
                        className={cn(
                          "w-fit px-4 py-2 rounded-2xl text-[15px]",
                          isMe
                            ? ["bg-blue-500 text-white self-end", isLast && "rounded-br-xs"]
                            : ["bg-neutral-200/50 text-neutral-700", isLast && "rounded-bl-xs"],
                          displayUser && !isLast && "ml-11"
                        )}
                      >
                        <div className="leading-5">{message.content}</div>
                      </div>
                    </div>
                  );
                })}

                <div
                  className={cn(
                    "flex text-[13px] text-neutral-700 leading-5",
                    isMe && "self-end",
                    displayUser && !isMe && "ml-11"
                  )}
                >
                  {displayUser && !isMe && <span>{group.sender.name} ·&nbsp;</span>}
                  <time dateTime={group.createdAt}>{formatRelativeDate(group.createdAt)}</time>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageListEndRef} className="-mt-4" />
      </div>
    </>
  );
};

function groupMessages(messages: any[]) {
  const groups: {
    sender: any;
    messages: any[];
    createdAt: string;
  }[] = [];

  for (let i = 0; i < messages.length; i++) {
    const current = messages[i];
    const prev = messages[i - 1];

    const currentTime = new Date(current.message.createdAt);
    const prevTime = prev ? new Date(prev.message.createdAt) : null;

    const isSameSender = prev && current.user.id === prev.user.id;
    const isWithinOneMinute = prev && differenceInMinutes(currentTime, prevTime!) <= 1;

    if (isSameSender && isWithinOneMinute) {
      groups[groups.length - 1].messages.push(current);
    } else {
      groups.push({
        sender: current.user,
        messages: [current],
        createdAt: current.message.createdAt,
      });
    }
  }

  return groups;
}

export default ChatMessageList;
