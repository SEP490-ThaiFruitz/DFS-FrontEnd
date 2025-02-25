"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Blog } from '@/app/(admin)/admin/blog/page'
import PaginationCustom from '@/components/global-components/data-table/paging-custom'
import { Skeleton } from '@/components/ui/skeleton'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ApiResponse, PageResult } from '@/types/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogPage() {
  const { isPending, data: blogs } = useFetch<ApiResponse<PageResult<Blog>>>("/Blogs", ["Blogs", "Guest"])

  return (
    <>
      {isPending ? <div className='lg:col-span-3'>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(9)].map((_, index) => (
            <Skeleton className='h-96 w-full flex flex-col border shadow-md' key={index + 1} />
          ))}
        </div>
      </div>
        :
        <div className='lg:col-span-3'>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs?.value?.items.map((blog: Blog) => (
              <Link
                href={`/blogs/${blog.id}`}
                key={blog.id}
                className="max-h-96 flex flex-col bg-white rounded-xl border shadow-md overflow-hidden hover:shadow-lg transition duration-300 hover:cursor-pointer hover:scale-105"
              >
                <div className="w-full h-48 relative">
                  <Image
                    src={"/images/dried-fruit.webp"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-xl p-3"
                    alt={blog.title}
                  />
                </div>

                <div className="p-3 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold mb-2" >{blog.title}</h2>
                  <div className="text-gray-600 text-sm line-clamp-5 whitespace-pre-line">
                    <p dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </div>
                </div>

                <div className="border-t w-full p-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{blog.blogCategory.name}</p>
                    <p className="text-xs text-gray-400 ml-auto">
                      {formatTimeVietNam(new Date(blog.createdOnUtc))}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <PaginationCustom
            itemsPerPage={blogs?.value?.pageIndex ?? 0}
            totalItems={blogs?.value?.totalPages ?? 0}
            onChangePageIndex={(pageNumber) => {
              console.log('Page changed to:', pageNumber);
            }}
            hidden
          />
        </div>}
    </>
  )
}

export default BlogPage