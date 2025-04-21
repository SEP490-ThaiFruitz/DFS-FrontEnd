"use client";

import { useState, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  X,
  Plus,
  Loader2,
  Captions,
  Heading1,
  Tag,
  ImageIcon,
  BookUp,
  ChartBarStacked,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { SerializedEditorState } from "lexical";
import { cn } from "@/lib/utils";
import { styleInput } from "@/lib/common-style";
import { toast } from "sonner";
import axios from "axios";
import { API } from "@/app/key/url";

import Cookies from "js-cookie";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { BLOG_KEY } from "@/app/key/comm-key";
import { CuisineSelector } from "@/components/custom/_custom_select/cuisine-selector";
import { useData } from "@/providers/data-provider";
import { BlogPost } from "@/types/blogs.types";
import AnimatedSelect from "@/components/custom/_custom_select/animated-select";

import { useConfirm } from "@/hooks/use-confirm";

// Dynamically import the editor to reduce initial load time
const Editor = dynamic(() => import("@/components/blocks/editor-x/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
    </div>
  ),
});

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Tiêu đề phải có ít nhất 15 ký tự.",
  }),
  content: z.string().min(10, {
    message: "Nội dung phải có ít nhất 10 ký tự.",
  }),
  thumbnail: z.instanceof(File).optional(),
  blogCategoryId: z.coerce.number().int({
    message: "Vui lòng chọn loại bài viết.",
  }),

  tagNames: z
    .array(z.string())
    .min(1, {
      message: "Vui lòng chọn ít nhất một tag.",
    })
    .default([]),
});

const CATEGORIES = [
  {
    id: 1,
    name: "Thị Trường",
  },
  {
    id: 2,
    name: "Sức Khỏe",
  },
  {
    id: 3,
    name: "Tin Tức",
  },
];

export const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hãy thêm bài viết của bạn!",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

const options = [
  "Giàu chất xơ",
  "Không chất bảo quản",
  "Hỗ trợ tiêu hóa",
  "Tốt cho làn da",
  "Thân thiện với người ăn kiêng",
  "Tăng cường sức đề kháng",
  "Tự nhiên 100%",
  "Không đường hóa học",

  "Ăn vặt hàng ngày",
  "Mang đi học",
  "Ăn khi tập gym",
  "Quà tặng sức khỏe",
  "Đồ ăn cho bé",
  "Snack văn phòng",
  "Thực phẩm cho người ăn kiêng",
  "Dùng trong salad/sữa chua",
];

export default function BlogForm() {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("editor");

  const [selectPostId, setSelectPostId] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      blogCategoryId: 2,
      tagNames: [],
    },
  });

  const { blogs } = useData();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        form.setValue("thumbnail", file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  const queryClient = useQueryClient();

  const token = Cookies.get("accessToken");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const [ConfirmDialog, confirm] = useConfirm(
    "Bạn có chắc chắn muốn xóa không?",
    "Nếu đồng ý xóa, bạn sẽ không thể khôi phục lại bài viết này."
  );

  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   setIsSubmitting(true);
  //   const formData = new FormData();
  //   formData.append("Title", values.title);
  //   formData.append("Content", values.content);
  //   formData.append("BlogCategoryId", values.blogCategoryId.toString());

  //   values.tagNames.forEach((tag) => {
  //     formData.append("TagNames", tag);
  //   });

  //   if (values.thumbnail) {
  //     formData.append("Thumbnail", values.thumbnail);
  //   }

  //   try {
  //     const response = await axios.post(`${API}/Blogs`, formData, {
  //       headers: {
  //         ...headers,
  //         "Content-Type": "multipart/form-data", //* important to set this header for file uploads
  //       },
  //     });

  //     // console.log({ response });
  //     if (response.status) {
  //       form.reset();
  //       queryClient.invalidateQueries({
  //         queryKey: [BLOG_KEY.BLOGS],
  //       });
  //       setEditorState(initialValue);
  //       setThumbnailPreview(null);
  //       setUploadProgress(0);
  //       toast.success("Tải lên bài viết thành công!");
  //     }

  //     // console.log("Response:", response.data);
  //   } catch (error) {
  //     console.log({ error });
  //     toast.error(
  //       "Có lỗi xảy ra trong quá trình tải lên bài viết của bạn. Vui lòng thử lại sau."
  //     );
  //   } finally {
  //     setIsSubmitting(false);

  //     setUploadProgress(0);
  //   }
  // };

  const onDelete = async (blogId: string) => {
    setIsSubmitting(true);

    const ok = await confirm();

    if (!ok) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.delete(`${API}/Blogs/${blogId}`, {
        headers: {
          ...headers,
        },
      });

      if (response.status) {
        queryClient.invalidateQueries({ queryKey: [BLOG_KEY.BLOGS] });
        toast.success("Xóa bài viết thành công!");
      }
    } catch (error) {
      console.log({ error });
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("Content", values.content);
    formData.append("BlogCategoryId", values.blogCategoryId.toString());

    values.tagNames.forEach((tag) => {
      formData.append("TagNames", tag);
    });

    if (values.thumbnail) {
      formData.append("Thumbnail", values.thumbnail);
    }

    try {
      let response;

      if (selectPostId) {
        formData.append("Id", selectPostId);

        // Chỉnh sửa
        response = await axios.put(`${API}/Blogs`, formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Tạo mới
        response = await axios.post(`${API}/Blogs`, formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status) {
        form.reset();
        queryClient.invalidateQueries({ queryKey: [BLOG_KEY.BLOGS] });
        setEditorState(initialValue);
        setThumbnailPreview(null);
        setUploadProgress(0);
        setSelectPostId(""); // Reset lại mode edit

        toast.success(
          selectPostId
            ? "Cập nhật bài viết thành công!"
            : "Tạo bài viết thành công!"
        );
      }
    } catch (error) {
      console.log({ error });
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleAddTag = (tag: string) => {
    if (newTag.trim() && !form.getValues("tagNames").includes(newTag.trim())) {
      form.setValue("tagNames", [...form.getValues("tagNames"), newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tagNames",
      form.getValues("tagNames").filter((tag) => tag !== tagToRemove)
    );
  };

  const handleToggleTags = (tag: string) => {
    const tags = form.getValues("tagNames");
    if (tags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      form.setValue("tagNames", [...tags, tag]);
    }
  };

  const handleReset = () => {
    // if (
    //   window.confirm(
    //     "Are you sure you want to reset the form? All your changes will be lost."
    //   )
    // ) {
    //   form.reset();
    //   setThumbnailPreview(null);
    //   setUploadProgress(0);
    // }
    form.reset();
    setThumbnailPreview(null);
    setEditorState(initialValue);
    setUploadProgress(0);
  };

  const handlePreview = () => {
    setActiveTab(activeTab === "editor" ? "preview" : "editor");
  };

  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  // useEffect(() => {
  //   if (!selectPostId || !blogs.data?.value?.items) return;

  //   const findBlog = blogs.data?.value?.items.find(
  //     (blog) => blog.id === selectPostId
  //   );

  //   if (findBlog) {
  //     form.setValue("title", findBlog.title);
  //     form.setValue("content", findBlog.content);
  //     form.setValue("blogCategoryId", findBlog.blogCategory.id);
  //     form.setValue("tagNames", findBlog.tagNames);
  //     setThumbnailPreview(findBlog.thumbnail);
  //     setEditorState(JSON.parse(findBlog.content));
  //   } else {
  //     form.setValue("content", JSON.stringify(editorState));
  //   }
  // }, [editorState, selectPostId, blogs.data?.value?.items]);

  // const tagWatch = form.watch("tagNames");
  useEffect(() => {
    const findBlog = blogs.data?.value?.items.find(
      (blog) => blog.id === selectPostId
    );

    if (findBlog) {
      if (form.getValues("title") !== findBlog.title) {
        form.setValue("title", findBlog.title);
      }

      const currentContent = form.getValues("content");
      if (currentContent !== findBlog.content) {
        form.setValue("content", findBlog.content, {
          shouldDirty: true,
        });
        // form.setValue("content", JSON.stringify(editorState), {
        //   shouldDirty: true,
        // });

        const parsed = JSON.parse(findBlog.content);
        setEditorState(parsed);
      }

      form.setValue("blogCategoryId", findBlog.blogCategory.id);
      form.setValue("tagNames", findBlog.tagNames);
      setThumbnailPreview(findBlog.thumbnail);
    } else {
      // Chỉ gọi khi chưa có content
      if (!form.getValues("content")) {
        // form.setValue("content", JSON.stringify(editorState));
        form.setValue("content", JSON.stringify(editorState), {
          shouldDirty: true,
        });
      }
    }
  }, [
    blogs.data?.value?.items,
    selectPostId,
    editorState,
    setEditorState,
    form,
  ]);

  useEffect(() => {
    form.setValue("content", JSON.stringify(editorState));
  }, [editorState]);

  const watchContent = form.watch("content");

  return (
    <>
      <ConfirmDialog />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
            {/* Main content area - 2/3 width on large screens */}
            <div className="lg:col-span-2 p-6 lg:p-8">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-1 mb-1">
                        <Heading1 className="size-6" /> Tiêu đề
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Hãy nhập tiêu đề hấp dẫn"
                          className={cn(
                            `text-lg py-6 px-4 border-slate-200 focus-visible:ring-slate-400 ${styleInput}`
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel className="text-base font-semibold flex items-center gap-1 mb-1">
                    <Captions className="size-6" /> Nội dung
                  </FormLabel>
                  <Tabs
                    defaultValue="editor"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <TabsList className="grid w-[200px] grid-cols-2">
                        <TabsTrigger value="editor">Nội dung</TabsTrigger>
                        <TabsTrigger value="preview">Xem trước</TabsTrigger>
                      </TabsList>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handlePreview}
                        className="text-slate-500 hover:text-slate-900"
                      >
                        {activeTab === "editor"
                          ? "Xem trước"
                          : "Quay lại nội dung"}
                      </Button>
                    </div>

                    <TabsContent value="editor" className="mt-0">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormControl>
                                <Editor
                                  maxLength={5000}
                                  editorSerializedState={editorState}
                                  onSerializedChange={(value) =>
                                    setEditorState(value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="preview" className="mt-0">
                      <Editor
                        maxLength={5000}
                        editorSerializedState={editorState}
                        // onSerializedChange={(value) => setEditorState(value)}
                        readOnly
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Sidebar - 1/3 width on large screens */}
            <div className="lg:col-span-1 bg-slate-50 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 cardStyle">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg flex items-center gap-1">
                      <BookUp className="size-6" />
                      Xuất bản bài viết
                    </h3>

                    <BlogsOptions
                      blogs={blogs.data?.value?.items ?? []}
                      setSelectPostId={setSelectPostId}
                      selectPostId={selectPostId}
                      onDelete={onDelete}
                      // selectPostId={form.getValues("blogId")}
                    />
                  </div>
                  <Separator className="bg-slate-200" />
                </div>

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={() => (
                    <FormItem className="space-y-4">
                      <div>
                        <FormLabel className="text-base font-semibold flex items-center gap-1">
                          <ImageIcon className="size-5" />
                          Hình tiêu đề
                        </FormLabel>
                        <FormDescription>
                          Hãy chọn ảnh chất lượng cao để thu hút người đọc
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="space-y-4">
                          <div
                            {...getRootProps()}
                            className={`
                            border-2 border-dashed rounded-lg p-4 transition-colors duration-200 ease-in-out cursor-pointer
                            ${
                              isDragActive
                                ? "border-primary bg-primary/5"
                                : "border-slate-200 hover:border-slate-300"
                            }
                            ${thumbnailPreview ? "bg-slate-50" : "bg-white"}
                          `}
                          >
                            <input {...getInputProps()} />
                            {thumbnailPreview ? (
                              <div className="relative">
                                <Image
                                  src={thumbnailPreview || "/placeholder.jpg"}
                                  alt="Thumbnail preview"
                                  width={500}
                                  height={200}
                                  className="w-full h-48 object-cover rounded-md"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    form.setValue("thumbnail", undefined);
                                    setThumbnailPreview(null);
                                    setUploadProgress(0);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                {uploadProgress < 100 && (
                                  <div className="mt-2">
                                    <Progress
                                      value={uploadProgress}
                                      className="h-1"
                                    />
                                    <p className="text-xs text-slate-500 mt-1 text-right">
                                      {uploadProgress}% uploaded
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-4 text-slate-500">
                                <ImageIcon className="h-10 w-10 mb-2 text-slate-400" />
                                <p className="text-sm font-medium mb-1">
                                  {isDragActive
                                    ? "Drop the image here"
                                    : "Drag & drop an image here"}
                                </p>
                                <p className="text-xs text-slate-400">
                                  hoặc nhấn vào đây để chọn ảnh
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blogCategoryId"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div>
                        <FormLabel
                          className="text-sm font-semibold flex items-center gap-1 mb-1
                      "
                        >
                          <ChartBarStacked className="size-5" />
                          Loại bài viết
                        </FormLabel>
                        <FormDescription>
                          Hãy chọn loại bài viết phù hợp với nội dung của bạn
                        </FormDescription>
                      </div>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={` bg-white border-slate-200 rounded-xl duration-200 focus:outline-none focus:ring-neutral-300 
                            placeholder:text-slate-700 
                             `}
                          >
                            <SelectValue placeholder="Chọn loại bài viết" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagNames"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div>
                        <FormLabel className="text-sm font-semibold flex items-center gap-1 mb-1">
                          <Tag className="size-5" /> Tags
                        </FormLabel>
                        <FormDescription>
                          Hãy thêm các thẻ để giúp người đọc tìm thấy bài viết
                          của bạn dễ dàng hơn
                        </FormDescription>
                      </div>
                      <FormControl>
                        <CuisineSelector
                          title="Tags"
                          options={options}
                          activeOptions={field.value}
                          toggleCuisine={handleToggleTags}
                          className="font-semibold text-sm italic"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="flex items-center justify-end gap-3 p-6 bg-slate-50 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            >
              Làm mới
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 bg-sky-600 hover:bg-sky-500 hoverAnimate transition duration-300 text-white hover:text-white"
              variant="outline"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải lên...
                </>
              ) : (
                "Tải lên bài viết"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

interface BlogOptionsProps {
  selectPostId: string;

  blogs: BlogPost[] | [];
  setSelectPostId: React.Dispatch<React.SetStateAction<string>>;

  onDelete: (blogId: string) => Promise<void>;
}

const BlogsOptions = ({
  blogs,
  selectPostId,
  setSelectPostId,
  onDelete,
}: BlogOptionsProps) => {
  const data = blogs.map((item) => {
    return {
      id: item.id,
      value: item.id,
      label: item.title,
      image: item.thumbnail,
      tags: item.tagNames,
    };
  });

  // console.log({ selectPostId });

  return (
    <div className="absolute top-2 right-5 z-10 w-full ">
      <AnimatedSelect
        data={data}
        defaultValue={selectPostId}
        onChange={setSelectPostId}
        title="Chọn bài viết"
        className="w-[600px]"
        onAction={onDelete}
      />
    </div>
  );
};
