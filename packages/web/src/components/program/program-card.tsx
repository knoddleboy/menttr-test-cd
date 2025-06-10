import { format } from "date-fns";
import ProgramType from "./program-type";
import ProgramDateRange from "./program-date-range";
import ProgramCapacityIndicator from "./program-capacity-indicator";
import { Link } from "react-router";
import ProgramStatus from "./program-status";
import Tags from "../tags";

type Props = {
  program?: any;
};

const ProgramCard = ({ program }: Props) => {
  // TODO: fix program owner not exist (used for main page)?
  return (
    <Link
      to={`${program.owner ? program.owner.username + "/" : ""}programs/${program.id}`}
      className="block w-full hover:bg-neutral-100/50"
    >
      <article className="p-4 flex flex-col gap-2.5">
        <div className="flex justify-between">
          <h1 className="text-[15px] text-neutral-700 font-bold">{program.title}</h1>

          <div className="text-sm text-neutral-500">
            <time
              dateTime={program.createdAt}
              title={`Created: ${format(program.createdAt, "MMM d, yyyy 'at' h:mm a")}`}
              className="hover:underline"
            >
              {format(program.createdAt, "MMM d")}
            </time>
            {program.status === "completed" && (
              <>
                &nbsp;/&nbsp;
                <time
                  dateTime={program.updatedAt}
                  title={`Archived: ${format(program.updatedAt, "MMM d, yyyy 'at' h:mm a")}`}
                  className="hover:underline"
                >
                  {format(program.updatedAt, "MMM d")}
                </time>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-9">
            <ProgramType type={program.type} />
            <ProgramDateRange startDate={program.startDate} endDate={program.endDate} />
            <div className="flex relative">
              <ProgramCapacityIndicator
                current={program.activeParticipants}
                max={program.maxParticipants}
              />
              {/* {pendingParticipantsCount && (
                <div
                  className="absolute top-1 -right-2 w-[5px] h-[5px] rounded-full bg-red-500"
                  title={`${pendingParticipantsCount} pending participants`}
                ></div>
              )} */}
            </div>
          </div>

          <ProgramStatus status={program.status} />
        </div>

        {program.description && (
          <p className="text-[15px] text-neutral-700 leading-5">
            {program.description.length > 120 ? (
              <>
                {program.description.slice(0, 120)}...&nbsp;
                <span
                  role="link"
                  tabIndex={0}
                  className="text-neutral-500 font-medium hover:underline"
                >
                  See more
                </span>
              </>
            ) : (
              program.description
            )}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Tags tags={program.skills} visibleCount={5} truncate />
        </div>
      </article>
    </Link>
  );
};

export default ProgramCard;
