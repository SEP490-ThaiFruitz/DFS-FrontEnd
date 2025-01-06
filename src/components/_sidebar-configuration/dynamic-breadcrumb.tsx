import React from "react";
import { capitalize } from "lodash";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export const DynamicBreadcrumb = () => {
  const pathname = usePathname();

  const path = pathname.split("/").filter((p) => p !== "");

  const breadcrumbs = path.map((item, index) => {
    return "/" + path.slice(0, index + 1).join("/");
    // return "/".concat(item);
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Admin sidebar</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <React.Fragment key={breadcrumb + index}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href={breadcrumb}>
                  {capitalize(breadcrumb.split("/").pop())}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
