"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { Blog } from "@/app/(admin)/admin/blog/page";
import NoData from "@/components/custom/_custom-no-data/no-data";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { ApiResponse } from "@/types/types";
import { CalendarDays, UserRoundPen } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

function BlogDetail() {
  const blogDetail: { id: string } = useParams();
  const { isPending, data: blog } = useFetch<ApiResponse<Blog>>(
    `/Blogs/${blogDetail.id}`,
    ["Blog", blogDetail.id]
  );

  const Loading = () => (
    <div className="lg:col-span-3">
      <div className="flex justify-center">
        <Skeleton className="w-[80%] h-12" />
      </div>
      <div className="flex flex-col gap-4 my-10">
        <div className="flex space-x-4 justify-center">
          <Skeleton className="w-56 h-8" />
        </div>
        <div className="flex space-x-4 justify-center">
          <Skeleton className="w-56 h-8" />
        </div>
      </div>
      <div className="mx-auto max-w-2xl">
        <Skeleton className="w-full h-72" />
      </div>
      <div className="mt-20">
        <Skeleton className="w-full h-96" />
      </div>
    </div>
  );

  const renderContent = () => {
    if (blog?.value) {
      return (
        <div className="lg:col-span-3">
          <span className="text-5xl font-bold text-center">
            {blog.value.title}
          </span>
          <div className="flex flex-col gap-4 my-10">
            <div className="flex space-x-4 justify-center">
              <CalendarDays />
              <span>
                {formatTimeVietNam(new Date(blog.value.createdOnUtc))}
              </span>
            </div>
            <div className="flex space-x-4 justify-center">
              <UserRoundPen />
              <span>{blog.value.user.name}</span>
            </div>
          </div>
          <div className="mx-auto max-w-2xl">
            <Image
              className="object-cover rounded-md w-full h-auto mx-auto"
              src={
                "https://th.bing.com/th/id/OIP.rgxW7Ykp9a3I9UV9i7iVaAHaE8rs=1&pid=ImgDetMain"
              }
              height={500}
              width={500}
              alt={blog.value.title}
            />
          </div>
          <div className="mt-14">
            <span dangerouslySetInnerHTML={{ __html: blog.value.content }} />
          </div>
        </div>
      );
    }
    return (
      <div className="lg:col-span-3">
        <NoData name="bài viết" />
      </div>
    );
  };

  return isPending ? Loading() : renderContent();
}

export default BlogDetail;
