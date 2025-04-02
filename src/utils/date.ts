import { eachDayOfInterval, format, formatDistanceToNow } from "date-fns";
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

    fields.forEach((field) => {
      result[field as string] = dayData[field as string] || 0;
    });

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

const daysSince = (date: string | Date) => {
  return (
    Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24)
    ) < 1
  );
};
