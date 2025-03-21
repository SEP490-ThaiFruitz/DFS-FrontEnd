"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";

import { SidebarFilter } from "@/features/client/sidebar-filter/sidebar-filter";
import { Editor } from "@/components/blocks/editor-x/editor";

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
