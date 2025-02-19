import {
  createLoader,
  parseAsString,
  parseAsInteger,
} from "nuqs/server";

export const filterParams = {
  pageSize: parseAsInteger.withDefault(10),
  pageIndex: parseAsInteger.withDefault(1),
  searchTerm: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(filterParams);
