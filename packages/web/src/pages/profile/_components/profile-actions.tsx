import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import ConvertMentorFlow from "../_flows/convert-mentor";
import { FaGear } from "react-icons/fa6";

type Props = {
  isMentor: boolean;
};

const ProfileActions = ({ isMentor }: Props) => {
  return (
    <div className="flex gap-2">
      {isMentor ? (
        <Button variant="primary" className="flex-1" asChild>
          <Link to="programs/new">New program</Link>
        </Button>
      ) : (
        <ConvertMentorFlow
          trigger={
            <Button variant="primary" className="flex-1">
              Switch to mentor
            </Button>
          }
        />
      )}

      <Button variant="secondary" className="flex-1" asChild>
        <Link to="/profile/edit">Edit profile</Link>
      </Button>

      {/* TODO: remove or activate */}
      {false && (
        <Button variant="secondary" className="size-10" asChild>
          <Link to="/profile/settings">
            <FaGear className="size-5 text-neutral-700" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;
