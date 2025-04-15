"use client";

import { MessageCircleMoreIcon, PhoneCall, PhoneMissed } from "lucide-react";
import {
  GooeyMenu,
  GooeyMenuAfter,
  GooeyMenuBefore,
  GooeyMenuTrigger,
} from "./gooey/gooey-menu-floating";
import { DialogReused } from "./dialog-reused";

import { useState } from "react";
import { useChat, type UseChatOptions } from "@ai-sdk/react";

import { cn } from "@/lib/utils";
// import { transcribeAudio } from "@/lib/utils/audio";
import { Chat } from "@/components/ui/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { recordAudio, transcribeAudio } from "@/lib/audio-utils";

const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B" },
  { id: "deepseek-r1-distill-llama-70b", name: "Deepseek R1 70B" },
];

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"];
};

export const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const iconStyle =
    "size-6 hover:scale-125 transition-transform duration-300 ease-in-out";

  const props = {
    initialMessages: [],
  };

  return (
    <GooeyMenu
      className="fixed h-10 w-10 bottom-28 right-10 z-20 "
      direction="horizontal"
    >
      <GooeyMenuBefore>
        <DialogReused
          trigger={
            <PhoneCall onClick={() => setIsOpen(true)} className={iconStyle} />
          }
          description={"Bạn có thể hỏi bất cứ điều gì!"}
          title={"Hỏi đáp cùng AI"}
          // content={<SpaceChat />}
          content={<ChatDemo {...props} />}
          open={isOpen}
          onClose={setIsOpen}
          // className="max-w-[400px] md:max-w-[700px] max-h-[70%] overflow-hidden"
          className="w-[90vw] rounded-3xl md:w-[50vw] max-w-[700px] h-[80vh] md:h-auto min-h-[700px] overflow-hidden"
        />

        <PhoneMissed className={iconStyle} />
      </GooeyMenuBefore>

      <GooeyMenuTrigger>
        <MessageCircleMoreIcon size={25} />
      </GooeyMenuTrigger>
    </GooeyMenu>
  );
};

export function ChatDemo(props: ChatDemoProps) {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
    setMessages,
  } = useChat({
    ...props,
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
  });

  // console.log(messages);

  return (
    <div className={cn("flex", "flex-col", "h-[500px]", "w-full")}>
      <div className={cn("flex", "justify-end", "mb-2")}>
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Chat
        className="grow"
        messages={messages as any}
        handleSubmit={handleSubmit}
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={isLoading}
        stop={stop}
        append={append}
        setMessages={setMessages}
        transcribeAudio={transcribeAudio}
        // transcribeAudio={recordAudio}
        suggestions={[
          "Trái cây xấy có những đặc tính gì?",
          "Có bao nhiêu phương pháp cho trái cây xấy?",
          "Ăn trái cây xấy có giảm cân được không?",
        ]}
      />
    </div>
  );
}
