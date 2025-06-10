import UserAvatar from "@/components/user-avatar";
import { capitalize } from "@/libs/utils";
import { format } from "date-fns";
import { FaClock } from "react-icons/fa6";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";
import PendingApplicationDetails from "./pending-application-details";
import ProcessedApplicationDetails from "./processed-application-details";

type Props = {
  application: any;
  entryKind: "pending" | "processed";
  onDecisionSuccess?: () => void;
};

const MentorApplicationEntry = ({ application, entryKind, onDecisionSuccess }: Props) => {
  const user = application.user;

  return (
    <div className="flex justify-between items-center rounded-md hover:bg-neutral-200/50 p-2">
      <div className="flex items-center gap-3">
        <Link to={`/${user.username}`}>
          <UserAvatar
            name={user.name}
            avatar={user.profileImageUrl}
            className="size-10 rounded-md"
          />
        </Link>

        <div>
          <div className="text-neutral-700 font-semibold text-sm leading-5">{user.name}</div>
          <div className="text-neutral-500 font-normal text-sm leading-5">
            <Link to={`/${user.username}`} className="hover:underline">
              @{user.username}
            </Link>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-neutral-700 font-medium">
            {entryKind === "pending" && <FaClock className="size-4 text-yellow-500" />}
            {entryKind === "processed" &&
              (application.status === "accepted" ? (
                <FaCheckCircle className="size-4 text-green-500" />
              ) : (
                <FaTimesCircle className="size-4 text-orange-500" />
              ))}

            <span className="text-sm text-neutral-500">{capitalize(application.status)}</span>
          </div>

          <div className="w-32 text-center">
            <time
              dateTime={application.createdAt}
              className="block text-[13px] text-neutral-500 leading-5"
            >
              {format(application.createdAt, "MMM d 'at' h:mm a")}
            </time>
          </div>

          {entryKind === "pending" && (
            <PendingApplicationDetails
              application={application}
              onDecisionSuccess={onDecisionSuccess}
            />
          )}
          {entryKind === "processed" && <ProcessedApplicationDetails application={application} />}
        </div>
      </div>
    </div>
  );
};

export default MentorApplicationEntry;
