import { format } from "date-fns";
import ProgramType from "./program-type";
import ProgramDateRange from "./program-date-range";
import ProgramCapacityIndicator from "./program-capacity-indicator";
import { Link, useNavigate } from "react-router";
import ProgramStatus from "./program-status";
import Tags from "../tags";
import UserAvatar from "../user-avatar";

type Props = {
  program?: any;
};

const ProgramUserCard = ({ program }: Props) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const isLink = (e.target as HTMLElement).closest("a");

    if (!isLink) {
      navigate(`${program.owner ? program.owner.username + "/" : ""}programs/${program.id}`);
    }
  };

  return (
    <article
      className="p-4 flex items-start gap-5 hover:bg-neutral-200/25 cursor-pointer"
      tabIndex={0}
      onClick={handleClick}
    >
      <Link to={`/${program.owner.username}`}>
        <UserAvatar
          name={program.owner.name}
          avatar={program.owner.profileImageUrl}
          className="size-16 text-2xl"
        />
      </Link>

      <div className="flex-1">
        <Link to={`/${program.owner.username}`} className="hover:underline text-neutral-700">
          {program.owner.name}
        </Link>

        <div className="w-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-[17px] text-neutral-700 font-bold">{program.title}</h1>

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
                </div>
              </div>

              <ProgramStatus status={program.status} />
            </div>

            {program.description && (
              <p className="text-[15px] text-neutral-700 leading-5">
                {program.description.length > 320 ? (
                  <>
                    {program.description.slice(0, 320)}...&nbsp;
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
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProgramUserCard;
