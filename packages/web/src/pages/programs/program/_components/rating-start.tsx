import { cn } from "@/libs/utils";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";

type Props = {
  initialRating?: number;
  totalStars?: number;
  readOnly?: boolean;
  className?: string;
  onRate?: (rating: number) => void;
};

const RatingStars = ({
  initialRating = 0,
  totalStars = 5,
  readOnly = false,
  className,
  onRate,
}: Props) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (!readOnly) {
      setRating(index);
      onRate?.(index);
    }
  };

  return (
    <div className="flex [&>button]:first:pl-0 [&>button]:last:pr-0">
      {[...Array(totalStars)].map((_, i) => {
        const index = i + 1;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(null)}
            className={cn(
              "size-7 px-0.5 text-neutral-300 cursor-pointer active-effect",
              index <= (hover ?? rating) && "text-orange-500",
              readOnly && "pointer-events-none",
              className
            )}
          >
            <FaStar className="size-full" />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
