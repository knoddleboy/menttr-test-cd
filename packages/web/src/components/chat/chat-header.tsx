import { Link } from "react-router";
import UserAvatar from "../user-avatar";

type Props = {
  title: string;
  avatarUrl: string;
  linkTo: string;
};

const ChatHeader = ({ title, avatarUrl, linkTo }: Props) => {
  return (
    <div className="p-4 border-b border-neutral-200">
      <div className={"flex items-center gap-4"}>
        <Link to={linkTo} className="hover:opacity-85">
          <UserAvatar name={title} avatar={avatarUrl} />
        </Link>
        <Link to={linkTo} className="text-neutral-700 font-semibold hover:underline">
          {title}
        </Link>
      </div>
    </div>
  );
};

export default ChatHeader;
