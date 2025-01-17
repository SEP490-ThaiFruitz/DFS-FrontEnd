import { ImagesSlider } from "@/components/global-components/images-slider";
import Image from "next/image";

import firstBackground from "/images/first-background.jpg";
import thirdBackground from "/images/third-background.png";
import secondBackground from "/images/second-background.webp";
import fourthBackground from "/images/fourth-background.png";

const ClientPage = () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
    "/images/second-background.png",
    "/images/forth-background.png",
  ];

  return (
    <div className="flex flex-col  h-full">
      <ImagesSlider images={images} className="h-[85vh]">
        {/* <div className="flex flex-col items-center gap-1 mr-2">
        <Image
          src="/images/dried-fruit.webp"
          alt="Picture of the author"
          width={50}
          height={50}
        />
        <h1 className="text-slate-700 font-serif italic">ThaiFruitz</h1>
      </div> */}
        <div>test</div>
      </ImagesSlider>
    </div>
  );
};

export default ClientPage;
