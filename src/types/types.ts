import { filterSchema } from "@/lib/parser";
import { ColumnSort } from "@tanstack/react-table";
import { AriaAttributes, DOMAttributes } from "react";
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

export type PageResult<T> = {
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: T[];
};

export interface ClassNameType<T> extends AriaAttributes, DOMAttributes<T> {
  className?: string;
}

export type ResponseData<T> = {
  value: {
    items: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  isSuccess: boolean;
  error: {
    code: string;
    message: string;
  };
};

// {
//   "value": {
//     "items": [],
//     "pageIndex": 1,
//     "pageSize": 10,
//     "totalCount": 0,
//     "hasNextPage": false,
//     "hasPreviousPage": false
//   },
//   "isSuccess": true,
//   "error": {
//     "code": "",
//     "message": ""
//   }
// }
