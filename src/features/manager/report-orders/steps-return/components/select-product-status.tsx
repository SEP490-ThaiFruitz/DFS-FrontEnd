import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memo } from "react";
import {
  ProductInCombo,
  SelectedItemsDetailsType,
} from "../../return-order-dialog";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/global-components/aceternity/file-upload";

const itemConditions = [
  { value: "Chưa mở bao bì", label: "Chưa mở bao bì" },
  {
    value: "Đã mở bao bì nhưng chưa sử dụng",
    label: "Đã mở bao bì nhưng chưa sử dụng",
  },
  { value: "Đã dùng thử một phần", label: "Đã dùng thử một phần" },
  {
    value: "Có mùi lạ hoặc hương vị bất thường",
    label: "Có mùi lạ hoặc hương vị bất thường",
  },
  {
    value: "Bị ẩm, mốc hoặc có dấu hiệu hư hỏng",
    label: "Bị ẩm, mốc hoặc có dấu hiệu hư hỏng",
  },
  {
    value: "Bao bì rách, móp khi nhận hàng",
    label: "Bao bì rách, móp khi nhận hàng",
  },
  {
    value: "Hạn sử dụng quá ngắn hoặc đã hết",
    label: "Hạn sử dụng quá ngắn hoặc đã hết",
  },
  { value: "Giao sai loại trái cây sấy", label: "Giao sai loại trái cây sấy" },
];

interface SelectProductStatusProps {
  // selectedItemsDetails: SelectedItemsDetailsType;

  // setSelectedItemsDetails: React.Dispatch<
  //   React.SetStateAction<SelectedItemsDetailsType>
  //   //   Record<
  //   //     string,
  //   //     { productStatus: string; images: File[]; quantity?: number }
  //   //   >
  //   // >
  // >;

  item: {
    orderItemDetailId: string;
    orderItemId: string;
    quantity: number;
  };

  selectProductInCombo: ProductInCombo[];
  setSelectProductInCombo: React.Dispatch<
    React.SetStateAction<ProductInCombo[]>
  >;
}

export const SelectProductStatus = memo(
  ({
    item,
    selectProductInCombo,
    setSelectProductInCombo,
  }: SelectProductStatusProps) => {
    const updateField = (
      id: string,
      field: keyof ProductInCombo,
      value: any
    ) => {
      setSelectProductInCombo((prev) =>
        prev.map((item) =>
          item.orderItemDetailId === id ? { ...item, [field]: value } : item
        )
      );
    };

    const currentItem = selectProductInCombo.find(
      (product) => product.orderItemDetailId === item.orderItemDetailId
    );

    return (
      <div className="min-w-full ">
        <div className="flex flex-col items-center gap-2 my-2 ">
          <div className=" mb-6 flex-1 w-full">
            <div className="flex flex-col gap-x-2 w-full mb-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Tình trạng sản phẩm
              </h3>
              <Select
                // value={selectedItemsDetails[item.id]?.productStatus}

                value={currentItem?.productStatus}
                onValueChange={(value) =>
                  updateField(item.orderItemDetailId, "productStatus", value)
                }
                // onValueChange={(value) => updateField(itemDetail.id, "productStatus", value)}

                // onValueChange={setItemCondition}

                // onValueChange={(value) =>
                //   setSelectProductInCombo((prev: SelectedItemsDetailsType) => {
                //     // console.log(value);
                //     return {
                //       ...prev,
                //       [item.id]: {
                //         ...prev[item.id],
                //         productStatus: value,
                //       },
                //     };
                //   })
                // }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn tình trạng sản phẩm" />
                </SelectTrigger>
                <SelectContent>
                  {itemConditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6 flex-1 w-full">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Số lượng sản phẩm
              </h3>

              <Select
                // value={
                //   selectedItemsDetails[item.id]?.quantity?.toString() ?? "1"
                // }
                value={currentItem?.quantity?.toString() ?? "1"}
                // onValueChange={setItemCondition}

                // onValueChange={(value) =>
                //   setSelectedItemsDetails((prev: SelectedItemsDetailsType) => {
                //     // console.log(value);

                //     return {
                //       ...prev,
                //       [item.id]: {
                //         ...prev[item.id],
                //         quantity: parseInt(value),
                //       },
                //     };
                //   })
                // }
                onValueChange={(value) =>
                  updateField(
                    item.orderItemDetailId,
                    "quantity",
                    parseInt(value)
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn số lượng" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: item.quantity })
                    .fill(0)
                    .map((_, index) => {
                      return (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {index + 1}
                        </SelectItem>
                      );
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-x1">
            <Label className="text-sm font-medium text-slate-700 mb-2">
              Tải ảnh minh chứng
            </Label>
            <FileUpload
              // onChange={(files: File[]) =>
              //   setSelectedItemsDetails((prev: SelectedItemsDetailsType) => ({
              //     ...prev,
              //     [item.id]: {
              //       ...prev[item.id],
              //       images: files,
              //     },
              //   }))
              // }
              onChange={(files: File[]) =>
                updateField(item.orderItemDetailId, "images", files)
              }
            />
          </div>
        </div>
      </div>
    );
  }
);

SelectProductStatus.displayName = "SelectProductStatus";
