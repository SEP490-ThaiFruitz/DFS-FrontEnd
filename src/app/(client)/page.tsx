import { ImagesSlider } from "@/components/global-components/images-slider";
import Image from "next/image";

const ClientPage = () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
  ];

  return (
    <div className="text-center h-full w-full flex items-center justify-center bg-yellow-100">
      <ImagesSlider images={images}>
        <div className="flex flex-col items-center gap-1 mr-2">
          <Image
            src="/images/dried-fruit.webp"
            alt="Picture of the author"
            width={50}
            height={50}
          />
          <h1 className="text-slate-700 font-serif italic">ThaiFruitz</h1>
        </div>
      </ImagesSlider>
    </div>
  );
};

export default ClientPage;
