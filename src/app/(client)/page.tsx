import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";

const ClientPage = () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
    "/images/second-background.png",
    "/images/forth-background.png",
  ];

  return (
    <div className="flex flex-col h-full">
      <ImagesSlider images={images} className="h-[85vh]">
        <BannerText />
      </ImagesSlider>
    </div>
  );
};

export default ClientPage;
