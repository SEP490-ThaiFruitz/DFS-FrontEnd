"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, SerializedEditorState } from "lexical";

import { FloatingLinkContext } from "@/components/editor/context/floating-link-context";
import { SharedAutocompleteContext } from "@/components/editor/context/shared-autocomplete-context";
import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";

interface EditorProps {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;

  maxLength?: number;

  readOnly?: boolean;
}

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

//* component nay co the tai su dung, nhung thuc te lai khong can nhieu options nhu vay, nen sau se duoc set dieu kien chi su dung nhung options can thiet
const Editor = ({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  maxLength,

  readOnly,
}: EditorProps) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editable: readOnly ? false : true,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <SharedAutocompleteContext>
            <FloatingLinkContext>
              <Plugins maxLength={maxLength} />

              <OnChangePlugin
                ignoreSelectionChange={true}
                // ignoreSelectionChange={false}
                onChange={(editorState) => {
                  onChange?.(editorState);
                  onSerializedChange?.(editorState.toJSON());
                }}
              />
            </FloatingLinkContext>
          </SharedAutocompleteContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
};

export default Editor;
