import { format } from "date-fns";
import { FaArrowRight } from "react-icons/fa6";

type Props = {
  startDate: string;
  endDate?: string;
};

const ProgramDateRange = ({ startDate, endDate }: Props) => {
  return (
    <div className="flex items-center gap-1.5 text-[15px] text-neutral-700 leading-5 whitespace-nowrap">
      <time
        dateTime={startDate}
        title={`Starts: ${format(startDate, "MMM d, yyyy")}`}
        className="hover:underline"
      >
        {!endDate && "From "}
        {format(startDate, "MMM d, yyyy")}
      </time>
      {endDate && (
        <>
          <FaArrowRight className="size-3" />
          <time
            dateTime={endDate}
            title={`Ends: ${format(endDate, "MMM d, yyyy")}`}
            className="hover:underline"
          >
            {format(endDate, "MMM d, yyyy")}
          </time>
        </>
      )}
    </div>
  );
};

export default ProgramDateRange;
