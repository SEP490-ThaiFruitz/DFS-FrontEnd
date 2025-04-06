type GroupedChartData = Record<
  string,
  {
    [key: string]: any; // dynamic keys like 'date', 'totalSpend', etc.
  }
>;

interface GroupOptions {
  groupBy: string; // e.g., "createdAt"
  sumField: string; // e.g., "totalSpend"
  arrayFields?: string[]; // e.g., ["name", "email"]
  formatGroupKey?: (val: any) => string; // optional formatter for the group key (e.g., date)
}

function groupByField<T extends Record<string, any>>(
  data: T[],
  options: GroupOptions
): any[] {
  const {
    groupBy,
    sumField,
    arrayFields = [],
    formatGroupKey = (val) => val.split("T")[0], // default: extract date if it's a datetime
  } = options;

  const grouped: GroupedChartData = {};

  data.forEach((item) => {
    const rawKey = item[groupBy];
    const key = formatGroupKey(rawKey);

    if (!grouped[key]) {
      grouped[key] = {
        [groupBy]: key,
        [sumField]: 0,
        ...arrayFields.reduce((acc, field) => {
          acc[field] = [];
          return acc;
        }, {} as Record<string, any[]>),
      };
    }

    grouped[key][sumField] += item[sumField];

    arrayFields.forEach((field) => {
      grouped[key][field].push(item[field]);
    });
  });

  return Object.values(grouped);
}
