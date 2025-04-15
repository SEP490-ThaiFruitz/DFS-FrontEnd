import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  formatDistanceToNow,
} from "date-fns";
import { vi } from "date-fns/locale";

export const YYYY_MM_DD = "yyyy-MM-dd";

export const createDateRange = (fromDate: string, toDate: string) => {
  return eachDayOfInterval({
    start: new Date(fromDate),
    end: new Date(toDate),
  }).map((date) => format(date, YYYY_MM_DD)); // Đảm bảo định dạng ngày giống trong dữ liệu của bạn
};

export const formatDateFns = (date: Date) => {
  // return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  return format(new Date(date), "MMM d, yyyy");
};

export const vietnameseDate = (date: Date | string, isTime?: boolean) => {
  const dateTrans = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const day = new Date(dateTrans).toLocaleDateString("vi-VN", options);
  const time = new Date(dateTrans).toLocaleTimeString("vi-VN");

  if (isTime) {
    return `${day} ${time}`;
  }

  return `${day}`;
};

export const currentDate = format(new Date(), "yyyy-MM-dd");

export const fillMissingDatesDynamics = <T>(
  data: T[],
  allDates: string[],
  fieldDate: keyof T & string,
  fields: (keyof T)[]
) => {
  const dataMap = data.reduce(
    (
      acc: Record<string, Record<string, number>>,
      curr: T
    ): Record<string, Record<string, any>> => {
      const date = curr[fieldDate] as string;

      acc[date] = fields.reduce(
        (obj: Record<string, any>, field: keyof T): Record<string, any> => {
          obj[field as string] = curr[field] as number;
          return obj;
        },
        {} as Record<string, number>
      );

      return acc;
    },
    {} as Record<string, Record<string, number>>
  );

  return allDates.map((date: string) => {
    const dayData = dataMap[date] || {};
    const result: Record<string, number | string> = { date };

    // console.log(dayData);
    fields.forEach((field) => {
      result[field as string] = dayData[field as string] || 0;
    });

    // console.log(result);

    return result;
  });
};

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch (error) {
    return dateString;
  }
};

export const formatRelativeTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    });
  } catch (error) {
    return dateString;
  }
};

export const daysSince = (date: string | Date) => {
  return (
    Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24)
    ) < 1
  );
};

export const differenceDate = (date: string | Date) => {
  const estimateDate = new Date(date); // => Tue Apr 15 2025
  const today = new Date(); // giả sử hôm nay là '2025-04-09'

  const daysLeft = differenceInCalendarDays(estimateDate, today);

  return daysLeft;
};

/**
 * Filters data based on a date range and calculates metrics for the current and previous periods.
 * @param {T[]} data - The array of data to filter.
 * @param {(item: T) => Date} getDate - A function to extract the date field from each item.
 * @param {Date} currentFrom - Start date of the current period.
 * @param {Date} currentTo - End date of the current period.
 * @returns {{ currentPeriodData: T[]; previousPeriodData: T[] }} - Filtered data for both periods.
 */
export const filterDataByDateRange = <T>(
  data: T[],
  getDate: (item: T) => Date,
  currentFrom: Date,
  currentTo: Date
): { currentPeriodData: T[]; previousPeriodData: T[] } => {
  // Helper function to filter data by date range
  const filterByRange = (startDate: Date, endDate: Date): T[] => {
    return data.filter((item) => {
      const itemDate = getDate(item);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Calculate the previous period date range
  const previousFrom = new Date(currentFrom);
  previousFrom.setDate(
    previousFrom.getDate() - (currentTo.getDate() - currentFrom.getDate() + 1)
  );

  const previousTo = new Date(currentFrom);
  previousTo.setDate(previousTo.getDate() - 1);

  // Filter data for current and previous periods
  const currentPeriodData = filterByRange(currentFrom, currentTo);
  const previousPeriodData = filterByRange(previousFrom, previousTo);

  return { currentPeriodData, previousPeriodData };
};
