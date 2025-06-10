import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export type UserAvatarProps = {
  name: string;
  avatar: string | null;
  className?: string;
};

const UserAvatar = ({ name, avatar, className }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={avatar || undefined} alt={`${name}'s avatar`} />
      <AvatarFallback>{Array.from(name)[0]?.toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
