import { interactApi } from "@/actions/client/interact-api";
import { DataTable } from "@/components/global-components/data-table/data-table";
import { Category, columns } from "@/features/admin/category/column";
import { ResponseData } from "@/types/types";

const CategoryPage = async () => {
  const categories = (await interactApi.get(
    "/Categories"
  )) as ResponseData<Category>;

  // console.log("data: ", categories.value.items);

  return (
    <div className="p-4">
      <DataTable
        data={categories?.value?.items || []}
        columns={columns}
        searchFiled="name"
      />
    </div>
  );
};

export default CategoryPage;

// "use client";
// import { getCategories } from "@/actions/category";
// import { CreateCategoryDialog } from "@/components/custom/_custom-dialog/create-category-dialog";
// import { DataTable } from "@/components/global-components/data-table/data-table";

// import { Category, columns } from "@/features/admin/category/column";
// import { PageResult } from "@/types/types";
// import React, { useEffect, useState } from "react";

// const CategoryPage = () => {
//   const [data, setData] = useState<PageResult<Category>>();
//   useEffect(() => {
//     getCategories().then((response: PageResult<Category>) => {
//       setData(response);
//       console.log(response);
//     });
//   }, []);

//   console.log({ data });

//   return (
//     <div className="mx-4 lg:mx-20">
//       <div className="flex justify-end">
//         <CreateCategoryDialog />
//       </div>
//       <div className="py-4">
//         <DataTable data={data?.items || []} columns={columns} />
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;
