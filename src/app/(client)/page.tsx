import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";
import VoucherSlide from "@/features/client/home/voucher-slide";
import Promotion from "@/features/client/home/promotion";
import CategorySlide from "@/features/client/home/category-slide";
import { MarqueeMarketing } from "@/features/client/home/marquee-marketing";
import dynamic from "next/dynamic";
import { AppleCardBlogsCarousel } from "@/features/client/home/apple-card-carousel-blogs";
// import { ProductFilterSidebarContainer } from "@/components/custom/filter-product-sidebar/product-filter-sidebar-container";

const ProductFilterSidebarContainer = dynamic(() =>
  import(
    "@/components/custom/filter-product-sidebar/product-filter-sidebar-container"
  ).then((mod) => mod.ProductFilterSidebarContainer)
);

const ClientPage = () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
    "/images/second-background.png",
    "/images/forth-background.png",
    "/marque/image-1.avif",
    "/marque/image-2.avif",
    "/marque/image-3.avif",
    "/marque/image-4.avif",
    "/marque/image-5.avif",
    "/marque/image-6.avif",
    "/marque/image-7.avif",
    "/marque/image-8.avif",
  ];

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <ImagesSlider images={images} className="h-[85vh]">
          <BannerText />
        </ImagesSlider>
        <VoucherSlide />
        <Promotion />

        <CategorySlide />

        <AppleCardBlogsCarousel />

        {/* <div className=" my-10 max-w-full rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800"> 
      
      */}

        <MarqueeMarketing />
        {/* </div> */}

        {/* <BestSellter /> */}
      </div>
      {/* <ProductFilterSidebar /> */}

      <ProductFilterSidebarContainer />
    </>
  );
};

export default ClientPage;
