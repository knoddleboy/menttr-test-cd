import UserAvatar from "@/components/user-avatar";
import { Link } from "react-router";
import RatingStars from "./rating-start";
import { formatRelativeDate } from "@/libs/utils";

type Props = {
  review: any;
};

const ReviewsListItem = ({ review }: Props) => {
  return (
    <div key={review.id} className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <Link to={`/${review.user.username}`} className="hover:opacity-85">
            <UserAvatar name={review.user.name} avatar={review.user.profileImageUrl} />
          </Link>

          <div className="space-y-0.5">
            <Link
              to={`/${review.user.username}`}
              className="block text-sm text-neutral-700 font-medium leading-5 hover:underline"
            >
              {review.user.name}
            </Link>

            <div className="flex items-center gap-2">
              <RatingStars initialRating={review.rating} className="size-4 px-px" readOnly />
              <div className="text-neutral-700 text-sm font-medium leading-5">
                {review.rating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="text-neutral-500 text-[13px] leading-5">
          {formatRelativeDate(review.createdAt)}
        </div>
      </div>

      <p className="text-neutral-500 text-[15px]">{review.content}</p>
    </div>
  );
};

export default ReviewsListItem;
