type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : undefined extends T[K] ? K : never;
}[keyof T];

type A = {
  id: string;
  name?: string;
  description: string | null;
};

type Nullable = NullableKeys<A>;
