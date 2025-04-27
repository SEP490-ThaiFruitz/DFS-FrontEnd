import ImagePreview from "@/components/custom/_custom-image/image-preview";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { NotData } from "@/components/global-components/no-data";
import { ImageIcon, ImageOffIcon, Info, ShieldAlertIcon } from "lucide-react";

interface ProveImagesProps {
  productStatus: string | null;

  customerImage: string | null;

  receiveImage: string | null;
}
export const ProveImages = ({
  customerImage,
  productStatus,
  receiveImage,
}: ProveImagesProps) => {
  return (
    <div className="cardStyle p-6">
      <div className="">
        <h4 className=" font-semibold mb-2 flex items-center gap-1 text-base">
          <Info className="size-6 text-slate-400" />
          Tình trạng sản phẩm
        </h4>
        <AdvancedColorfulBadges size="lg" color="violet">
          {productStatus}
        </AdvancedColorfulBadges>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <h4 className=" font-semibold mb-2 flex items-center gap-1 text-base">
            <ImageIcon className="size-6 text-slate-400" />
            Hình ảnh từ khách hàng
          </h4>
          {customerImage ? (
            <ImagePreview
              images={[customerImage]}
              alt="Customer provided image"
              initialHeight={130}
              initialWidth={130}
              className="object-cover size-32 rounded-3xl"
            />
          ) : (
            <NotData
              icons={[ImageIcon, ShieldAlertIcon, ImageOffIcon]}
              title="Chưa có hình ảnh từ chứng minh"
              description="Có vẻ như chưa có hình ảnh từ chứng minh từ bạn cho sản phẩm này"
              className="min-w-full"
            />
          )}
        </div>

        <div>
          <h4 className=" font-semibold mb-2 flex items-center gap-1 text-base">
            <ImageIcon className="size-6 text-slate-400" />
            Hình ảnh xác nhận từ nhân viên
          </h4>
          {receiveImage ? (
            <ImagePreview
              images={[receiveImage]}
              alt="Customer provided image"
              initialHeight={130}
              initialWidth={130}
              className="object-cover size-32 rounded-3xl"
            />
          ) : (
            <NotData
              icons={[ImageIcon, ShieldAlertIcon, ImageOffIcon]}
              title="Đang chờ hình ảnh xác nhận từ nhân viên"
              description="Quá trình xác nhận đang diễn ra, vui lòng chờ đợi"
              className="min-w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};
