import { z } from "zod";

export const FormCategoryBlogSafeTypes = z.object({
    name: z.string().nonempty({
        message: "Vui lòng nhập loại bài viết"
    })
});

export const FormBlogSafeTypes = z.object({
    title: z.string().nonempty({
        message: "Vui lòng nhập tên bài viết"
    }),
    categoryBlogId: z.string().nonempty({
        message: "Vui lòng chọn loại bài viết"
    }),
    image: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
    content: z.string().nonempty({
        message: "Vui nhập nội dung"
    }),
});