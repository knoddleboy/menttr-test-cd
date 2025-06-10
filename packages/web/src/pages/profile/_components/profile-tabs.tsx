import PageLoading from "@/components/page-loading";
import ProgramCard from "@/components/program/program-card";
import { Tabs, TabsContent, TabsEmpty, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewsListItem from "@/pages/programs/program/_components/reviews-list-item";
import { useJoinedPrograms } from "@/services/program/joined-programs";
import { useOwnPrograms } from "@/services/program/own-programs";
import { useUserReviews } from "@/services/reviews/get-user-reviews";
import type { UserDto } from "@/stores/auth";
import { FaArrowTurnUp } from "react-icons/fa6";
import { Link } from "react-router";

type Props = {
  isOwnProfile: boolean;
  user: UserDto;
};

const TabKeys = {
  // Primary
  OwnPrograms: "programs",
  JoinedProrams: "joined",
  Posts: "posts",
  Reviews: "reviews",
  // Secondary
  OwnPrograms__Active: "programs/active",
  OwnPrograms__Archived: "programs/archived",
  JoinedProrams__Active: "joined/active",
  JoinedProrams__Pending: "joined/pending",
  JoinedProrams__Archived: "joined/archived",
};

const ProfileTabs = ({ isOwnProfile, user }: Props) => {
  const { data } = useUserReviews(user.id);

  const isMentor = user.role === "mentor";

  return (
    <Tabs
      defaultValue={
        isMentor ? TabKeys.OwnPrograms : isOwnProfile ? TabKeys.JoinedProrams : TabKeys.Posts
      }
      className="gap-0 flex-1"
    >
      <TabsList>
        {/**
         * Actors: Mentor
         * Visibility: Self (My programs), others (Programs)
         */}
        {isMentor && (
          <TabsTrigger value={TabKeys.OwnPrograms}>
            {isOwnProfile ? "My programs" : "Programs"}
          </TabsTrigger>
        )}

        {/**
         * Actors: Mentor, Mentee
         * Visibility: Self (Joined programs)
         */}
        {isOwnProfile && <TabsTrigger value={TabKeys.JoinedProrams}>Joined programs</TabsTrigger>}

        {/**
         * Actors: Mentor, Mentee
         * Visibility: All (Posts)
         */}
        <TabsTrigger value={TabKeys.Posts}>Posts</TabsTrigger>

        {/**
         * Actors: Mentor
         * Visibility: All (Reviews (count))
         */}
        {isMentor && (
          <TabsTrigger value={TabKeys.Reviews}>
            Reviews ({data?.reviews?.length ?? "-"})
          </TabsTrigger>
        )}
      </TabsList>

      {isMentor && (
        <TabsContent value={TabKeys.OwnPrograms}>
          <ProfileOwnProgramsTabContent userId={user.id} isOwnProfile={isOwnProfile} />
        </TabsContent>
      )}

      {isOwnProfile && (
        <TabsContent value={TabKeys.JoinedProrams}>
          <ProfileJoinedProgramsTabContent userId={user.id} />
        </TabsContent>
      )}

      <TabsContent value={TabKeys.Posts}>{/* Content */}</TabsContent>

      {isMentor && (
        <TabsContent value={TabKeys.Reviews}>
          <ProfileReviewsTabContent userId={user.id} />
        </TabsContent>
      )}
    </Tabs>
  );
};

const ProfileOwnProgramsTabContent = ({
  userId,
  isOwnProfile,
}: {
  userId: number;
  isOwnProfile: boolean;
}) => {
  const { programs, isPending } = useOwnPrograms(userId);

  if (isPending) {
    return <PageLoading />;
  }

  return (
    <Tabs defaultValue={TabKeys.OwnPrograms__Active} className="gap-0">
      <TabsList>
        <TabsTrigger value={TabKeys.OwnPrograms__Active}>
          Active ({programs?.active.count})
        </TabsTrigger>

        <TabsTrigger value={TabKeys.OwnPrograms__Archived}>
          Archived ({programs?.archived.count})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={TabKeys.OwnPrograms__Active}>
        {programs?.active.count ? (
          <div className="divide-y divide-neutral-200">
            {programs?.active.items.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <TabsEmpty
            title={
              isOwnProfile
                ? "You haven't created any programs yet."
                : "This mentor hasn't created any programs yet."
            }
            subtitle={
              isOwnProfile
                ? "Once you do, they'll appear here."
                : "Once they do, they'll appear here."
            }
          />
        )}
      </TabsContent>

      <TabsContent value={TabKeys.OwnPrograms__Archived}>
        {programs?.archived.count ? (
          <div className="divide-y divide-neutral-200">
            {programs?.archived.items.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <TabsEmpty
            title={
              isOwnProfile
                ? "You haven't archived any programs yet."
                : "This mentor hasn't archived any programs yet."
            }
            subtitle={
              isOwnProfile
                ? "Once you do, they'll appear here."
                : "Once they do, they'll appear here."
            }
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

const ProfileJoinedProgramsTabContent = ({ userId }: { userId: number }) => {
  const { programs, isPending } = useJoinedPrograms(userId);

  if (isPending) {
    return <PageLoading />;
  }

  return (
    <Tabs defaultValue={TabKeys.JoinedProrams__Active} className="gap-0">
      <TabsList>
        <TabsTrigger value={TabKeys.JoinedProrams__Active}>
          Active ({programs?.active.count})
        </TabsTrigger>

        <TabsTrigger value={TabKeys.JoinedProrams__Pending}>
          Pending ({programs?.pending.count})
        </TabsTrigger>

        <TabsTrigger value={TabKeys.JoinedProrams__Archived}>
          Archived ({programs?.archived.count})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={TabKeys.JoinedProrams__Active}>
        {programs?.active.count ? (
          <div className="divide-y divide-neutral-200">
            {programs?.active.items.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <TabsEmpty
            title="You haven't joined to any programs yet."
            subtitle="Once you do, they'll appear here."
          />
        )}
      </TabsContent>

      <TabsContent value={TabKeys.JoinedProrams__Pending}>
        {programs?.pending.count ? (
          <div className="divide-y divide-neutral-200">
            {programs?.pending.items.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <TabsEmpty
            title="You haven't applied to any programs yet."
            subtitle="Once you do, you'll see your applications here."
          />
        )}
      </TabsContent>

      <TabsContent value={TabKeys.JoinedProrams__Archived}>
        {programs?.archived.count ? (
          <div className="divide-y divide-neutral-200">
            {programs?.archived.items.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <TabsEmpty
            title="You don't have any archived programs yet."
            subtitle="Once you complete a program, it will show up here."
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

const ProfileReviewsTabContent = ({ userId }: { userId: number }) => {
  const { data, isPending } = useUserReviews(userId);

  if (isPending) {
    return <PageLoading />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-4">
      {data.reviews.map((review) => (
        <div className="space-y-2">
          <div className="group w-fit flex items-center gap-2 text-neutral-500 hover:text-neutral-700">
            <FaArrowTurnUp className="size-4 rotate-90" />
            <Link
              to={`/${review.user.username}/programs/${review.program.id}`}
              className="text-[15px] font-medium group-hover:underline"
            >
              {review.program.title}
            </Link>
          </div>
          <ReviewsListItem key={review.id} review={review} />
        </div>
      ))}
    </div>
  );
};

export default ProfileTabs;
