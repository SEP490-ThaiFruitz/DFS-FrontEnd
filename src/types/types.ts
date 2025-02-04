import { filterSchema } from "@/lib/parser";
import { ColumnSort } from "@tanstack/react-table";
import { z } from "zod";

export type StringKeyOf<TData> = Extract<keyof TData, string>;
export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>;
  label: string;
  placeholder?: string;
  options?: Option[];
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>;
  }
>;
