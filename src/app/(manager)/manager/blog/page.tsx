// import BlogForm from "@/features/manager/blog/blog-form";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const Blog = dynamic(() => import("@/features/manager/blog/blog-form"), {
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
    </div>
  ),
});

const BlogPageManager = () => {
  return <Blog />;
};

export default BlogPageManager;
