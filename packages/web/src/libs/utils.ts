import { clsx, type ClassValue } from "clsx";
import {
  addMinutes,
  format,
  isThisWeek,
  isToday,
  isYesterday,
  parseISO,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatRelativeDate(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;

  if (isToday(date)) {
    // 4:15 PM
    return format(date, "HH:mm");
  }

  if (isYesterday(date)) {
    // Yesterday, 4:15 PM
    return `Yesterday, ${format(date, "HH:mm")}`;
  }

  if (isThisWeek(date)) {
    // Monday, 4:15 PM
    return `${format(date, "EEEE")}, ${format(date, "HH:mm")}`;
  }

  // Apr 12, 4:15 PM
  return format(date, "MMM d, HH:mm");
}

export function extractLinkedInUsername(url: string) {
  try {
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;

    const match = pathname.match(/^\/in\/([^/?#]+)/);
    if (match && match[1]) {
      return match[1];
    }

    return null;
  } catch {
    return null;
  }
}

export const getRoundedTime = (shiftMinutes = 0) => {
  const now = shiftMinutes > 0 ? addMinutes(new Date(), shiftMinutes) : new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  const roundedDate = setMilliseconds(setSeconds(setMinutes(now, roundedMinutes), 0), 0);
  return format(roundedDate, "HH:mm");
};
