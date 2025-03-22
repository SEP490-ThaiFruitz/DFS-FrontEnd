import { eachDayOfInterval, format } from "date-fns";

export const YYYY_MM_DD = "yyyy-MM-dd";

export const createDateRange = (fromDate: string, toDate: string) => {
  return eachDayOfInterval({
    start: new Date(fromDate),
    end: new Date(toDate),
  }).map((date) => format(date, YYYY_MM_DD)); // Đảm bảo định dạng ngày giống trong dữ liệu của bạn
};

export const fillMissingDates = <T>(
  data: T[],
  allDates: string[],
  fieldDate: keyof T & string,
  fieldValue: keyof T & string
) => {
  // Khởi tạo dataMap với kiểu Record<string, number> để đảm bảo giá trị là số
  const dataMap = data.reduce((acc, curr) => {
    acc[curr[fieldDate] as string] = curr[fieldValue] as number; // Đảm bảo giá trị của fieldValue là số
    return acc;
  }, {} as Record<string, number>);

  return allDates.map((date) => ({
    date,
    revenue: dataMap[date] || 0, // Nếu không có doanh thu cho ngày này thì gán 0
  }));
};

export const formatDateFns = (date: Date) => {
  // return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  return format(new Date(date), "MMM d, yyyy");
};

export const vietnameseDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const day = new Date(date).toLocaleDateString("vi-VN", options);
  const time = new Date(date).toLocaleTimeString("vi-VN");
  return `${day} `;
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
