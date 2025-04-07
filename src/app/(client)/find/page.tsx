"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";

import { SidebarFilter } from "@/features/client/sidebar-filter/sidebar-filter";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
// import { Editor } from "@/components/blocks/editor-x/editor";

const Editor = dynamic(() => import("@/components/blocks/editor-x/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
    </div>
  ),
});

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
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

const FindPage = () => {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  console.log(JSON.stringify(editorState));

  return (
    <div className="h-auto py-20">
      {/* <SidebarFilter /> */}
      <Editor
        maxLength={2500}
        editorSerializedState={editorState}
        onSerializedChange={(value) => setEditorState(value)}
      />
    </div>
  );
};

export default FindPage;
