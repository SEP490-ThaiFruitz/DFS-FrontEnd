import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";
import VoucherSlide from "@/features/client/home/voucher-slide";
import Promotion from "@/features/client/home/promotion";
import CategorySlide from "@/features/client/home/category-slide";
import { MarqueeMarketing } from "@/features/client/home/marquee-marketing";
import dynamic from "next/dynamic";
import { AppleCardBlogsCarousel } from "@/features/client/home/apple-card-carousel-blogs";
import { AnimatedTestimonials } from "@/components/global-components/aceternity/animated-testimonial";
import { placeholderImage } from "@/utils/label";
// import { ProductFilterSidebarContainer } from "@/components/custom/filter-product-sidebar/product-filter-sidebar-container";

type Feedback = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  rating: number;
  createdAt: string;
};
const feedbacks: Feedback[] = [
  {
    id: "1",
    user: { name: "Nguyen Van A", avatar: placeholderImage },
    content: "Sản phẩm rất tốt, giao hàng nhanh.",
    rating: 5,
    createdAt: "2025-04-01T08:30:00Z",
  },
  {
    id: "2",
    user: { name: "Tran Thi B", avatar: placeholderImage },
    content: "Chất lượng ổn, sẽ ủng hộ tiếp.",
    rating: 4,
    createdAt: "2025-04-02T09:15:00Z",
  },
  {
    id: "3",
    user: { name: "Le Van C", avatar: placeholderImage },
    content: "Hơi chậm giao hàng nhưng hàng đẹp.",
    rating: 4,
    createdAt: "2025-04-03T10:00:00Z",
  },
  {
    id: "4",
    user: { name: "Pham Thi D", avatar: placeholderImage },
    content: "Đóng gói cẩn thận, đáng tiền.",
    rating: 5,
    createdAt: "2025-04-04T11:20:00Z",
  },
  {
    id: "5",
    user: { name: "Hoang Van E", avatar: placeholderImage },
    content: "Sản phẩm giống mô tả, rất hài lòng.",
    rating: 5,
    createdAt: "2025-04-05T12:45:00Z",
  },
  {
    id: "6",
    user: { name: "Do Thi F", avatar: placeholderImage },
    content: "Giao hàng nhanh nhưng sản phẩm chưa xuất sắc.",
    rating: 3,
    createdAt: "2025-04-06T13:00:00Z",
  },
  {
    id: "7",
    user: { name: "Dang Van G", avatar: placeholderImage },
    content: "Không hài lòng với chất lượng.",
    rating: 2,
    createdAt: "2025-04-07T14:10:00Z",
  },
  {
    id: "8",
    user: { name: "Nguyen Thi H", avatar: placeholderImage },
    content: "Mua lần 2 vẫn rất tốt.",
    rating: 5,
    createdAt: "2025-04-08T15:20:00Z",
  },
  {
    id: "9",
    user: { name: "Le Van I", avatar: placeholderImage },
    content: "Giá hợp lý, chất lượng ổn.",
    rating: 4,
    createdAt: "2025-04-09T16:30:00Z",
  },
  {
    id: "10",
    user: { name: "Pham Thi J", avatar: placeholderImage },
    content: "Sản phẩm không giống hình ảnh.",
    rating: 2,
    createdAt: "2025-04-10T17:45:00Z",
  },
  {
    id: "11",
    user: { name: "Tran Van K", avatar: placeholderImage },
    content: "Dịch vụ khách hàng tốt.",
    rating: 4,
    createdAt: "2025-04-11T18:10:00Z",
  },
  {
    id: "12",
    user: { name: "Vo Thi L", avatar: placeholderImage },
    content: "Hàng đẹp, đúng mô tả.",
    rating: 5,
    createdAt: "2025-04-12T19:00:00Z",
  },
  {
    id: "13",
    user: { name: "Hoang Van M", avatar: placeholderImage },
    content: "Hàng bị lỗi nhẹ nhưng được hỗ trợ đổi.",
    rating: 3,
    createdAt: "2025-04-13T20:00:00Z",
  },
  {
    id: "14",
    user: { name: "Do Thi N", avatar: placeholderImage },
    content: "Chưa đúng kỳ vọng.",
    rating: 3,
    createdAt: "2025-04-14T21:15:00Z",
  },
  {
    id: "15",
    user: { name: "Bui Van O", avatar: placeholderImage },
    content: "Tạm ổn so với giá tiền.",
    rating: 3,
    createdAt: "2025-04-15T22:00:00Z",
  },
  {
    id: "16",
    user: { name: "Nguyen Thi P", avatar: placeholderImage },
    content: "Shop tư vấn rất nhiệt tình.",
    rating: 4,
    createdAt: "2025-04-16T23:10:00Z",
  },
  {
    id: "17",
    user: { name: "Le Van Q", avatar: placeholderImage },
    content: "Sẽ quay lại mua lần nữa.",
    rating: 5,
    createdAt: "2025-04-17T08:00:00Z",
  },
  {
    id: "18",
    user: { name: "Pham Thi R", avatar: placeholderImage },
    content: "Không hài lòng với dịch vụ.",
    rating: 1,
    createdAt: "2025-04-18T09:20:00Z",
  },
  {
    id: "19",
    user: { name: "Tran Van S", avatar: placeholderImage },
    content: "Tốt hơn mong đợi.",
    rating: 5,
    createdAt: "2025-04-19T10:30:00Z",
  },
  {
    id: "20",
    user: { name: "Vo Thi T", avatar: placeholderImage },
    content: "Đóng gói kỹ, hàng ổn áp.",
    rating: 4,
    createdAt: "2025-04-20T11:45:00Z",
  },
];

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

        <div className="container mx-auto mt-10 mb-10  gap-4 px-4 md:px-0">
          <AnimatedTestimonials testimonials={feedbacks} autoplay />
        </div>

        <AppleCardBlogsCarousel />

        <MarqueeMarketing />

        {/* <BestSellter /> */}
      </div>
      {/* <ProductFilterSidebar /> */}

      <ProductFilterSidebarContainer />
    </>
  );
};

export default ClientPage;
