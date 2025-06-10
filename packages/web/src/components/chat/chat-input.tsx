import { IoSend } from "react-icons/io5";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

type Props = {
  input: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
};

const ChatInput = ({ input, onChange, onSendMessage }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <Textarea
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
          }
        }}
        placeholder="Write a message..."
        className="min-h-10 px-4 w-full focus-visible:ring-0 !text-[15px] resize-none"
      />
      <Button
        type="button"
        variant="primary"
        className="w-10 h-10 shadow-xs"
        onClick={onSendMessage}
        disabled={!input.trim()}
      >
        <IoSend className="text-white size-5" />
      </Button>
    </div>
  );
};

export default ChatInput;
