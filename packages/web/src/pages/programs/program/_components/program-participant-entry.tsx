import UserAvatar from "@/components/user-avatar";
import { format } from "date-fns";
import { Link } from "react-router";
import PendingParticipantDetails from "./pending-participant-details";

type Props = {
  participant: any;
  entryKind: "active" | "pending";
  onDecisionSuccess?: () => void;
};

const ProgramParticipantEntry = ({ participant, entryKind, onDecisionSuccess }: Props) => {
  return (
    <div className="flex justify-between items-center rounded-md hover:bg-neutral-200/50 p-2">
      <div className="flex items-center gap-3">
        <Link to={`/${participant.user.username}`}>
          <UserAvatar
            name={participant.user.name}
            avatar={participant.user.profileImageUrl}
            className="size-10 rounded-md"
          />
        </Link>

        <div>
          <div className="text-neutral-700 font-semibold text-sm leading-5">
            {participant.user.name}
          </div>
          <div className="text-neutral-500 font-normal text-sm leading-5">
            <Link to={`/${participant.user.username}`} className="hover:underline">
              @{participant.user.username}
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-6">
          <div className="w-32 text-center">
            <time
              dateTime={participant.createdAt}
              className="block text-[13px] text-neutral-500 leading-5"
            >
              {format(participant.createdAt, "MMM d 'at' h:mm a")}
            </time>
          </div>

          {entryKind === "pending" && (
            <PendingParticipantDetails
              participant={participant}
              onDecisionSuccess={onDecisionSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramParticipantEntry;
