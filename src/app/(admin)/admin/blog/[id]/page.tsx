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

function BlogDetailPage() {
  const { id } = useParams();
  const { data: blog } = useFetch<ApiResponse<Blog>>(`/Blogs/${id}`);
  
  return (
    <div className="m-10">
      <Card>
        <CardHeader className="border-b-2">
          <CardTitle>Thông tin bài biết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="my-5 sm:mx-8 grid lg:grid-cols-2 gap-20">
            <div className="border shadow-md rounded-xl h-fit w-fit">
              {blog?.value?.thumbnail ? (
                <Image
                  className="h-fit w-fit p-2"
                  src={blog?.value?.thumbnail ?? "/images/dried-fruit.webp"}
                  height={100}
                  width={100}
                  alt="image"
                />
              ) : (
                <div className="min-h-44 text-gray-500 w-full flex items-center justify-center text-center text-xl font-semibold">
                  <div className="flex space-x-5">
                    <ImageOff />
                    <p>Không có ảnh</p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-7">
              <div className="grid grid-cols-2">
                <p className="font-semibold text-gray-600">Tên:</p>
                <p className="text-gray-800">{blog?.value?.title}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="font-semibold text-gray-600">Người đăng:</p>
                <p className="text-gray-800">{blog?.value?.user?.name}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="font-semibold text-gray-600">Loại bài viết:</p>
                <p className="text-gray-800">{blog?.value?.blogCategory?.name}</p>
              </div>
              <div className="grid grid-cols-2">
                <p className="font-semibold text-gray-600">Ngày tạo:</p>
                <p className="text-gray-800">
                  {formatTimeVietNam(new Date(blog?.value?.createdOnUtc ?? "N/A"))}
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p className="font-semibold text-gray-600">Ngày sửa:</p>
                <p className="text-gray-800">
                  {formatTimeVietNam(new Date(blog?.value?.modifiedOnUtc ?? "N/A"))}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-600">Nội dung:</p>
            <p dangerouslySetInnerHTML={{ __html: blog?.value?.content ?? "" }}></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BlogDetailPage;
