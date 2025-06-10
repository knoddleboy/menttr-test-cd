import Tags from "@/components/tags";
import UserAvatar from "@/components/user-avatar";
import UserBadge from "@/components/user-badge";
import ExpandableText from "@/components/expandable-text";
import type { UserDto } from "@/stores/auth";
import { FaLinkedin, FaLocationDot, FaStar } from "react-icons/fa6";
import ProfileMessage from "../_flows/profile-message";
import { Link } from "react-router";
import { extractLinkedInUsername } from "@/libs/utils";
import { useUserReviews } from "@/services/reviews/get-user-reviews";

type Props = {
  user: UserDto;
  isOwnProfile: boolean;
};

const ProfileHeader = ({ user, isOwnProfile }: Props) => {
  const { data } = useUserReviews(user.id);

  const isMentor = user.role === "mentor";

  return (
    <>
      <div className="flex gap-8">
        <UserAvatar
          name={user.name}
          avatar={user.profileImageUrl}
          className="size-28 rounded-3xl text-5xl"
        />

        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="-space-y-0.5">
              <div className="flex items-center gap-3">
                <h3 className="text-neutral-800 font-bold text-xl leading-7">{user.name}</h3>

                <div className="leading-7">
                  <UserBadge role={user.role} />
                </div>

                {/* Server should be responsible for issueing this info */}
                {isMentor && (
                  <div className="flex gap-1">
                    <FaStar className="text-orange-500 size-5" />
                    <span className="text-neutral-700 font-semibold text-[15px] leading-5">
                      {data?.reviews.length > 0 ? (data?.averageRating.toFixed(1) ?? "–") : "–"}
                    </span>
                  </div>
                )}
              </div>

              <span className="text-neutral-500 font-normal text-[15px] leading-5">
                @{user.username}
              </span>
            </div>

            {!isOwnProfile && <ProfileMessage userId={user.id} />}
          </div>

          <div className="flex items-center gap-4 text-neutral-700 text-[15px] pb-1">
            {user.location && (
              <div className="flex items-center gap-1">
                <FaLocationDot className="size-4" />
                {user.location?.city}, {user.location?.country}
              </div>
            )}

            {user.social && (
              <Link to={user.social} className="group flex items-center gap-1">
                <FaLinkedin className="size-4.5" />
                <span className="group-hover:underline">
                  {extractLinkedInUsername(user.social)}
                </span>
              </Link>
            )}
          </div>

          <Tags tags={user.skills} />
        </div>
      </div>

      <ExpandableText text={user.bio} />
    </>
  );
};

export default ProfileHeader;
