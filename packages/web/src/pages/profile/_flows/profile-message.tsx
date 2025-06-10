import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/services/messages/create-conversation";
import { useUserConversations } from "@/services/messages/user-conversations";
import { useNavigate } from "react-router";

type Props = {
  userId: number;
};

const ProfileMessage = ({ userId }: Props) => {
  const navigate = useNavigate();

  const { data } = useUserConversations();
  const { createConversation } = useCreateConversation();

  const handleClick = async () => {
    const existingConv = data.conversations.filter(
      (conv) => conv.isDirect && conv.participants.some((p) => p.userId === userId)
    )?.[0];

    if (existingConv) {
      return navigate(`/messages/${existingConv.id}`);
    }

    try {
      const conv = await createConversation({ userIds: [userId] });
      navigate(`/messages/${conv.id}`);
    } catch {
      //
    }
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      Message
    </Button>
  );
};

export default ProfileMessage;
