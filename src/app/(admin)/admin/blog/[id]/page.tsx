"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageOff } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { Blog } from "../page";
import Image from "next/image";
import { ApiResponse } from "@/types/types";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

function BlogDetailPage({ params }: BlogDetailPageProps) {
  // co the dung param tren ne

  //   const { id: blogId } = await params;

  //   console.log(blogId);

  const { id } = useParams();
  const { data: blog } = useFetch<ApiResponse<Blog>>(`/Blogs/${id}`);
  return (
    <div className="m-10">
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle>Thông tin bài biết</CardTitle>
        </CardHeader>
        <CardContent className="my-5 sm:mx-8 grid lg:grid-cols-2 gap-20">
          <div className="border shadow-md rounded-xl h-full">
            {blog?.value?.thumbnail ? (
              <Image
                className="h-full w-full p-2"
                src={
                  "https://res.cloudinary.com/deojypwtl/image/upload/v1737471584/" +
                  blog?.value?.thumbnail
                }
                height={100}
                width={100}
                alt="image"
              />
            ) : (
              <div className="h-full text-gray-500 w-full flex items-center justify-center text-center text-xl font-semibold">
                <div className="flex space-x-5">
                  <ImageOff />
                  <span>Không có ảnh</span>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-7">
            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-600">Tên:</span>
              <span className="text-gray-800">{blog?.value?.title}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-600">Người đăng:</span>
              <span className="text-gray-800">{blog?.value?.user?.name}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-600">
                Loại bài viết:
              </span>
              <span className="text-gray-800">
                {blog?.value?.blogCategory?.name}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-600">Ngày tạo:</span>
              <span className="text-gray-800">
                {formatTimeVietNam(new Date(blog!?.value!.createdOnUtc))}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="font-semibold text-gray-600">Ngày sửa:</span>
              <span className="text-gray-800">
                {formatTimeVietNam(new Date(blog!?.value!.modifiedOnUtc))}
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Nội dung:</span>
              <span>{blog?.value?.content}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BlogDetailPage;
