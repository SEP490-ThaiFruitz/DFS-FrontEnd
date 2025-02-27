"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import PaginationCustom from '@/components/global-components/data-table/paging-custom'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ApiResponse, PageResult } from '@/types/types'
import { CirclePlus, Eye, Filter, Pencil, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BlogCategory } from './category/page'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import { deleteBlog } from '@/actions/blog'


export interface Blog {
    id: string;
    title: string;
    content: string;
    thumbnail: string;
    user: {
        email: string;
        avatar: string;
        name: string;
    };
    blogCategory: {
        name: string;
    };
    createdOnUtc: string;
    modifiedOnUtc: string;
}

function BlogPage() {
    const { data: blogs } = useFetch<ApiResponse<PageResult<Blog>>>("/Blogs", ["Blogs", "admin"])
    const [pageIndex, setPageIndex] = useState<number>(blogs?.value?.pageIndex ?? 1);
    const [filter, setFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(blogs?.value?.pageSize ?? 10);

    const { data: categoriesBlog } = useFetch<ApiResponse<BlogCategory[]>>("/BlogCategories", ["BlogCategories", "select"])
    const [blog, setBlog] = useState<Blog | undefined>(undefined);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const form = useForm({
        defaultValues: {
            title: "",
            content: "",
            categoryBlog: "",
            createDate: ""
        },
    });

    const onSubmit = (data: any) => {
        console.log({ data })
    };

    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-semibold leading-none tracking-tight'>Bài viết</p>
                <Link href="/admin/blog/create">
                    <Button size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                        <CirclePlus />
                        Tạo bài viết
                    </Button>
                </Link>
            </div>
            {filter && (<div className='border p-5 rounded-lg shadow-sm mt-5 transform origin-top-right transition-all duration-5000 ease-in-out'>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10'>
                        <FormInputControl
                            form={form}
                            name="title"
                            disabled={form.formState.isSubmitting}
                            label="Tên bài viết"
                        />
                        <FormInputControl
                            form={form}
                            name="content"
                            disabled={form.formState.isSubmitting}
                            label="Nội dung"
                        />
                        <FormSelectControl
                            form={form}
                            name="categoryBlog"
                            disabled={form.formState.isSubmitting}
                            label="Loại bài viết"
                            items={categoriesBlog?.value?.map((blogCategory) => ({
                                id: blogCategory.id.toString(),
                                name: blogCategory.name
                            })) || []}
                        />
                        <FormInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="createDate"
                            type='Date'
                            disabled={form.formState.isSubmitting}
                            label="Ngày tạo"
                        />
                    </div>
                    <div className='space-x-7 mt-4'>
                        <Button
                            size={"sm"}
                            type="submit"
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            <Search /> Tìm kiếm
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            type="button"
                            onClick={() => form.reset()}
                        >
                            <Trash2 /> Xóa
                        </Button>
                    </div>
                </FormValues>
            </div>)}
            <div className='mt-10 flex'>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                        setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="w-fit whitespace-nowrap">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                        {[5, 10, 25, 50, 100, 1000].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className='ml-auto' onClick={() => setFilter(!filter)} size={"icon"} variant={"outline"}>
                    <Filter />
                </Button>
            </div>
            <div className="mt-3 border overflow-hidden shadow-sm rounded-lg min-w-full max-w-6xl overflow-x-auto">
                <Table className='overflow-x-auto'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] min-w-[300px]">Tên bài viết</TableHead>
                            <TableHead className="w-fit min-w-[120px]">Tác giả</TableHead>
                            <TableHead className="w-fit min-w-[130px]">Loại bài viết</TableHead>
                            <TableHead className="w-fit min-w-[130px]">Ngày tạo</TableHead>
                            <TableHead className="w-fit min-w-[140px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs?.value?.items.map((blog) => <TableRow key={blog.id}>
                            <TableCell className="font-bold">{blog.title}</TableCell>
                            <TableCell>{blog.user.name}</TableCell>
                            <TableCell>
                                {blog.blogCategory.name}
                            </TableCell>
                            <TableCell>
                                {formatTimeVietNam(new Date(blog.createdOnUtc))}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Link href={`/admin/blog/${blog.id}`}>
                                        <Button
                                            variant="outline"
                                            className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                        >
                                            <Eye />
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/blog/update/${blog.id}`}><Button
                                        variant="outline"
                                        className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                    >
                                        <Pencil />
                                    </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        onClick={() => {
                                            setIsOpenDelete(true)
                                            setBlog(blog)
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>
            <PaginationCustom itemsPerPage={pageSize} totalItems={blogs?.value?.totalCount ?? 0} onChangePageIndex={setPageIndex} />
            <DeleteDialog
                id={blog?.id ?? ""}
                isOpen={isOpenDelete}
                onClose={() => setIsOpenDelete(!isOpenDelete)}
                name={blog?.title}
                deleteFunction={deleteBlog}
            />
        </div>
    )
}

export default BlogPage