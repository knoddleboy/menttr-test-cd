import { useParams } from "react-router";
import { useUser } from "@/services/user";
import { usePublicProfile } from "@/services/user/public-profile";
import ProfileHeader from "./_components/profile-header";
import ProfileTabs from "./_components/profile-tabs";
import ProfileActions from "./_components/profile-actions";
import { useHeaderTitle } from "@/hooks/use-header-title";
import PageLoading from "@/components/page-loading";

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, isPending: isUserPending } = useUser();
  const isOwnProfile = !!currentUser && currentUser.username === username;

  const { publicUser, isLoading: isPublicUserLoading } = usePublicProfile(username!, {
    // Prevent fetching public user when viewing own profile
    enabled: isUserPending === isOwnProfile,
  });

  const user = isOwnProfile ? currentUser : publicUser;

  useHeaderTitle(isOwnProfile ? "Your Profile" : user?.name);

  if (isUserPending || isPublicUserLoading) {
    return <PageLoading />;
  }

  if (!isOwnProfile && !publicUser) {
    return (
      <main>
        <div className="max-2w-xl mx-auto py-10">
          <span className="text-neutral-800 text-2xl font-bold">This account doesn't exist.</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main>
      <div className="flex flex-col max-w-2xl h-full mx-auto py-10 gap-6">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        {isOwnProfile && <ProfileActions isMentor={user.role === "mentor"} />}
        <ProfileTabs user={user} isOwnProfile={isOwnProfile} />
      </div>
    </main>
  );
};

export default Profile;
