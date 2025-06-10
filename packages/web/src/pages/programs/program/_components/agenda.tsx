import { cn } from "@/libs/utils";
import { addDays, differenceInMinutes, format, isSameDay, isToday } from "date-fns";

type AgendaEvent = {
  id: string;
  topic: string;
  program: any;
  startTime: Date;
  endTime: Date;
};

type Props = {
  startDate: Date;
  events: AgendaEvent[];
};

const Agenda = ({ startDate, events }: Props) => {
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const eventsByDay = days.map((day) => {
    const dayEvents = events.filter((event) => isSameDay(event.startTime, day));
    return { day, events: dayEvents };
  });

  return (
    <div className="flex-2 px-4 pt-2 pb-4 overflow-x-hidden space-y-2">
      {eventsByDay.map(({ day, events }) => (
        <div key={day.toISOString()} className="text-sm text-neutral-700">
          <h3 className={cn("px-4 py-1 font-medium leading-5", isToday(day) && "text-orange-500")}>
            {isToday(day) && "Today · "}
            {format(day, "EEEE, MMM d")}
          </h3>

          {events.length > 0 ? (
            <ul className="divide-y divide-neutral-300">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="px-4 py-1 leading-5 bg-neutral-200/30 hover:bg-neutral-200/50 first:rounded-t-sm last:rounded-b-sm"
                >
                  <div className="text-neutral-500 text-[13px] leading-5">
                    {format(event.startTime, "HH:mm")} - {format(event.endTime, "HH:mm")} (
                    {formatDuration(event.startTime, event.endTime)})
                  </div>
                  <div>
                    <div className="font-semibold">{event.topic}</div>
                    <div>{event.program.title}</div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-1 leading-5 bg-neutral-200/50 hover:bg-neutral-200 rounded-sm">
              No events
            </p>
          )}
        </div>
      ))}
    </div>
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

export default Agenda;
