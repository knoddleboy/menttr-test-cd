import { Button } from "@/components/ui/button";
import { cn } from "@/libs/utils";
import { differenceInMinutes, format, getYear, isToday } from "date-fns";
import { FaArrowRight } from "react-icons/fa6";

type Props = {
  session: any;
};

const SessionListItem = ({ session }: Props) => {
  const sessionYear = getYear(session.startTime);
  const currentYear = getYear(new Date());

  return (
    <li className="w-full p-4 flex items-center gap-2 hover:bg-neutral-100/50">
      <div className="w-14 h-16 flex justify-center items-center shrink-0 rounded-md bg-neutral-200/50">
        <div className="text-neutral-700 text-center font-semibold">
          {sessionYear !== currentYear && (
            <div className="leading-3 text-[11px] text-neutral-500">
              {format(session.startTime, "y")}
            </div>
          )}
          <div className="leading-5">{format(session.startTime, "MMM")}</div>
          <div className="leading-5">{format(session.startTime, "dd")}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between">
          <div>
            <h1 className="text-[15px] text-neutral-700 font-bold">{session.topic}</h1>
            <div className="text-sm text-neutral-500 leading-5">
              {isToday(session.startTime) && "Today · "}
              {format(session.startTime, "EEEE")},&nbsp;
              <time dateTime={session.startTime}>{format(session.startTime, "HH:mm")}</time>
              &nbsp;-&nbsp;
              <time dateTime={session.endTime}>{format(session.endTime, "HH:mm")}</time>&nbsp;(
              {formatDuration(session.startTime, session.endTime)})
            </div>
          </div>
        </div>

        {session.agenda && (
          <p className="text-[15px] text-neutral-700 leading-5">
            {session.agenda.length > 120 ? (
              <>
                {session.agenda.slice(0, 120)}...&nbsp;
                <span
                  role="link"
                  tabIndex={0}
                  className="text-neutral-500 font-medium hover:underline"
                >
                  See more
                </span>
              </>
            ) : (
              session.agenda
            )}
          </p>
        )}
      </div>

      {!session.completed && isToday(session.startTime) && (
        <Button variant="primary" className="h-8">
          Join
          <FaArrowRight className="size-4" />
        </Button>
      )}
    </li>
  );
};

const formatDuration = (start: Date, end: Date): string => {
  const minutes = differenceInMinutes(end, start);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
};

export default SessionListItem;
