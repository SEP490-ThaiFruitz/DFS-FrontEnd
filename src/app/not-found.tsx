// "use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  //   const router = useRouter();
  //   const handleBackClick = () => {
  //     if (window.history.length > 1) {
  //       router.back();
  //     } else {
  //       router.push("/");
  //     }
  //   };
  return (
    // <div className="bg-[#f3f4f6]">
    //   <div className="lg:flex p-10 flex-row-reverse justify-center items-center min-h-screen">
    //     <Image
    //       className="mx-auto"
    //       height={600}
    //       width={600}
    //       src="/images/error.svg"
    //       alt="error"
    //     />
    //     <div className="w-96 mx-auto">
    //       <div className="my-5 text-4xl font-black">
    //         {" "}
    //         Oops, Không tìm thấy trang
    //       </div>
    //       <div className="text-xl font-bold">
    //         Có vẻ có lỗi khi chuyển qua trang khác
    //       </div>
    //       <div className="my-5">
    //         Thật không may, có lỗi xảy ra và trang này không tồn tại. Hãy thử sử
    //         dụng chức năng tìm kiếm hoặc quay lại trang trước.
    //       </div>
    //       <div className="flex items-center justify-between">
    //         <Button
    //           size="sm"
    //           variant={"outline"}
    //           className="flex items-center gap-2 px-4 py-2 font-bold"
    //           onClick={handleBackClick}
    //         >
    //           <Undo2 size={22} />
    //           <span>Quay lại</span>
    //         </Button>
    //         <Button
    //           size="sm"
    //           variant={"outline"}
    //           className="flex items-center gap-2 px-4 py-2 font-bold text-green-700 border-green-700"
    //           onClick={() => router.push("/")}
    //         >
    //           <HomeIcon size={22} />
    //           <span>Trang chủ</span>
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div className="bg-white font-mono min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-black text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-black sm:text-3xl font-bold mb-4">
                Oops! bạn đã đi lạc rồi
              </h3>
              <p className="mb-6 text-black sm:mb-5">
                Có vẻ như trang bạn đang tìm kiếm không tồn tại. Hãy thử quay
                lại trang trước hoặc trở về trang chủ.
              </p>

              <div className="flex justify-center mt-4">
                <Link
                  href="/"
                  className="my-5 bg-green-600 hoverAnimate hover:bg-green-700 rounded-lg p-2 flex items-center gap-2"
                >
                  <HomeIcon className="size-5" />
                  Trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
