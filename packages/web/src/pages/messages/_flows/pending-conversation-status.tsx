import { Button } from "@/components/ui/button";
import { useUpdateUserPendingConversation } from "@/services/messages/use-update-user-pending-conversation";
import { useNavigate } from "react-router";

type Props = {
  convId: number;
  initiatorName: string;
  onAccept?: () => void;
  onReject?: () => void;
};

const PendingConversationStatus = ({ convId, initiatorName, onAccept, onReject }: Props) => {
  const navigate = useNavigate();
  const { updateUserPendingConversation } = useUpdateUserPendingConversation();

  const handleAccept = async () => {
    try {
      await updateUserPendingConversation({ id: convId, status: "accepted" });
      navigate(`/messages/${convId}`);
      onAccept?.();
    } catch {
      //
    }
  };

  const handleReject = async () => {
    try {
      const confirmed = confirm("Are you sure you want to reject this conversation request?");
      if (!confirmed) return;
      await updateUserPendingConversation({ id: convId, status: "rejected" });
      navigate("/messages/requests");
      onReject?.();
    } catch {
      //
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-neutral-700 text-[15px] leading-5">
        {initiatorName} wants to message you. Accept the request to start chatting.
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={handleReject}>
          Reject
        </Button>
        <Button variant="primary" className="flex-1" onClick={handleAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default PendingConversationStatus;
