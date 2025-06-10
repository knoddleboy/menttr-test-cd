import { setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";

export function toDateTime(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  let combined = setHours(date, hours);
  combined = setMinutes(combined, minutes);
  combined = setSeconds(combined, 0);
  combined = setMilliseconds(combined, 0);

  return combined;
}
