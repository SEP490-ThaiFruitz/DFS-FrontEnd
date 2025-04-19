import { FileUpload } from "@/components/global-components/aceternity/file-upload";
import React, { memo } from "react";

interface ImagesTabProps {
  receiveImages: string[];

  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export const ImagesTab = memo(
  ({ receiveImages, setImages, images }: ImagesTabProps) => {
    return (
      <div className="m-0 p-0 motion-preset-slide-right motion-duration-300">
        <div className="space-y-4">
          <div className="flex flex-col items-start gap-2 mb-4">
            <h3 className="text-sm font-medium">
              Hình ảnh nhận hàng ({receiveImages.length})
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              Tải lên hình ảnh để lưu trữ bằng chứng về tình trạng sản phẩm khi
              nhận lại từ khách hàng.
            </p>
          </div>

          <div>
            <FileUpload
              // onChange={setImages}
              onChange={(updatedFiles) => {
                setImages(updatedFiles);
              }}
              value={images}
              multiple
              isImages
            />
          </div>
        </div>
      </div>
    );
  }
);

ImagesTab.displayName = "ImagesTab";
