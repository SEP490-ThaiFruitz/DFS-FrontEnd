import {
  parseAsFloat,
  createLoader,
  parseAsString,
  parseAsNumberLiteral,
} from "nuqs/server";

export const filterParams = {
  pageSize: parseAsFloat.withDefault(10),
  pageIndex: parseAsFloat.withDefault(10),
  searchTerm: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(filterParams);
