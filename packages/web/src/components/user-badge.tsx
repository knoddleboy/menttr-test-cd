import { Badge } from "./ui/badge";

type Props = {
  role: string;
};

const UserBadge = ({ role }: Props) => {
  return role === "mentee" ? (
    <Badge variant="mentee">Mentee</Badge>
  ) : (
    <Badge variant="mentor">Mentor</Badge>
  );
};

export default UserBadge;
