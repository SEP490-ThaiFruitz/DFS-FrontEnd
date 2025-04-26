import { z } from "zod";

export const FormCategoryBlogSafeTypes = z.object({
    name: z.string().nonempty({
        message: "Vui lòng nhập loại bài viết"
    })
});

export const UpdateBlogSafeTypes = z.object({
    title: z.string().nonempty({
        message: "Vui lòng nhập tên bài viết"
    }),
    categoryBlogId: z.string().nonempty({
        message: "Vui lòng chọn loại bài viết"
    }),
    image: z.any().optional(),
    isPublished: z.boolean(),
    tagNames: z.array(z.object({
        label:
            z.string({
                required_error: "Vui lòng nhập tag"
            }).nonempty({
                message: "Vui lòng nhập tag"
            }),
        value:
            z.string({
                required_error: "Vui lòng nhập tag"
            }).nonempty({
                message: "Vui lòng nhập tag"
            })
    })).min(1, "Vui lòng chọn ít nhất một thẻ tag"),
    content: z.string().optional()
});


export const CreateBlogSafeTypes = z.object({
    title: z.string().nonempty({
        message: "Vui lòng nhập tên bài viết"
    }),
    categoryBlogId: z.string().nonempty({
        message: "Vui lòng chọn loại bài viết"
    }),
    image: z.any().refine((file) => file != null, "Vui lòng chọn ảnh"),
    tagNames: z.array(z.object({
        label:
            z.string({
                required_error: "Vui lòng nhập tag"
            }).nonempty({
                message: "Vui lòng nhập tag"
            }),
        value:
            z.string({
                required_error: "Vui lòng nhập tag"
            }).nonempty({
                message: "Vui lòng nhập tag"
            })
    })).min(1, "Vui lòng chọn ít nhất một thẻ tag"),
    content: z.string().optional()
});
