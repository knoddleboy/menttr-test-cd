import { useProgram } from "@/services/program/program";
import CreateReviewDialog from "./create-review-dialog";
import PageLoading from "@/components/page-loading";
import { useUser } from "@/services/user";
import { useProgramReviews } from "@/services/reviews/get-reviews";
import RatingStars from "./rating-start";
import { Separator } from "@/components/ui/separator";
import ReviewsListItem from "./reviews-list-item";

type Props = {
  programId: number;
};

const ReviewsTabContent = ({ programId }: Props) => {
  const { user } = useUser();
  const { program, isPending: isProgramPending } = useProgram(programId);
  const { data, isPending: isReviewsPending, refetch } = useProgramReviews(programId);

  if (isProgramPending || isReviewsPending) {
    return <PageLoading />;
  }

  if (!user || !program || !data) {
    return null;
  }

  const reviews = data.reviews;
  const isOwnProgram = program.owner.id === user.id;
  const hasReviewed = reviews.some((r) => r.userId === user.id);
  const avgRating = averageRating(reviews);

  return (
    <div className="pt-10 flex flex-col justify-center items-center gap-5 overflow-hidden">
      {reviews.length > 0 ? (
        <>
          <div className="flex items-center flex-col gap-2 mb-2.5">
            <div className="text-3xl text-neutral-700 font-bold">{avgRating.toFixed(1)}</div>

            <div className="flex items-center flex-col gap-0.5">
              <RatingStars initialRating={avgRating} className="size-5.5" readOnly />
              <div className="text-neutral-500 text-[15px]">
                based on {reviews.length} review(s)
              </div>
            </div>
          </div>

          <Separator />

          <div className="w-full flex-1 space-y-2 overflow-y-auto">
            {reviews.map((review) => (
              <ReviewsListItem key={review.id} review={review} />
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-1 text-center">
          <div className="text-[15px] text-neutral-700 font-semibold">
            There are no reviews yet.
          </div>
          <div className="text-sm text-neutral-500 max-w-[50ch] mx-auto">
            {isOwnProgram
              ? "Once someone writes one, you'll see it here."
              : "Be the first to write one!"}
          </div>
        </div>
      )}

      {!isOwnProgram && !hasReviewed && (
        <CreateReviewDialog programId={programId} onSubmit={refetch} />
      )}
    </div>
  );
};

function averageRating<T extends { rating: number }>(items: T[]) {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + item.rating, 0);
  return total / items.length;
}

export default ReviewsTabContent;
