"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import {
  Card,
  Carousel,
} from "@/components/custom/apple-carousel/apple-card-carousel";
import { NotData } from "@/components/global-components/no-data";
import { useData } from "@/providers/data-provider";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const Blog = dynamic(() => import("@/components/blocks/editor-x/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
    </div>
  ),
});

export const AppleCardBlogsCarousel = () => {
  const { blogs } = useData();

  if (blogs.isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (blogs.data?.value?.items.length === 0) {
    return (
      <NotData
        action={{
          label: "Thử tải lại",
          onClick: () => blogs.refetch(),
        }}
      />
    );
  }

  const data = blogs?.data?.value?.items || [];

  // console.log(data);

  const blogsData = data.map((item) => {
    return {
      src: item.thumbnail,
      title: item.title,
      category: item.blogCategory.name,
      content: (
        <Blog
          editorSerializedState={
            item.content ? JSON.parse(item.content) : undefined
          }
          maxLength={2500}
          readOnly
        />
      ),
      tags: item.tagNames,
    };
  });

  const cards = blogsData.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout />
  ));

  return (
    <div className="w-full h-full py-20">
      {/* <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Get to know your iSad.
      </h2> */}

      <h1 className="my-14 text-center text-4xl font-bold font-sans ">
        Về Thaifruitz
      </h1>
      <Carousel items={cards} />
    </div>
  );
};
