type Order = {
  totalPrice: number;
} & Record<string, string | Date | number>;

type GroupedOrder = {
  month: string;
  total: number;
};

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTHS_VI: Record<string, string> = {
  Jan: "Tháng 1",
  Feb: "Tháng 2",
  Mar: "Tháng 3",
  Apr: "Tháng 4",
  May: "Tháng 5",
  Jun: "Tháng 6",
  Jul: "Tháng 7",
  Aug: "Tháng 8",
  Sep: "Tháng 9",
  Oct: "Tháng 10",
  Nov: "Tháng 11",
  Dec: "Tháng 12",
};

function formatMonthYear(date: Date): string {
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

function sortByMonthYear(a: GroupedOrder, b: GroupedOrder): number {
  const [aMonth, aYear] = a.month.split(" ");
  const [bMonth, bYear] = b.month.split(" ");

  if (aYear !== bYear) {
    return Number(aYear) - Number(bYear);
  }

  return MONTHS_SHORT.indexOf(aMonth) - MONTHS_SHORT.indexOf(bMonth);
}

export function groupOrdersByMonth(
  orders: any[],
  dateKey: keyof Order
): GroupedOrder[] {
  const monthlyData: Record<string, number> = {};

  for (const order of orders) {
    const date = new Date(order[dateKey as keyof Order]);
    const key = formatMonthYear(date);
    monthlyData[key] = (monthlyData[key] || 0) + order.totalPrice;
  }

  return Object.entries(monthlyData)
    .map(([month, total]) => ({ month, total }))
    .sort(sortByMonthYear);
}

export function translateMonthsToVietnamese(
  data: GroupedOrder[]
): GroupedOrder[] {
  return data.map(({ month, total }) => {
    const [engMonth, year] = month.split(" ");
    const viMonth = MONTHS_VI[engMonth] || engMonth;
    return { month: `${viMonth} ${year}`, total };
  });
}
