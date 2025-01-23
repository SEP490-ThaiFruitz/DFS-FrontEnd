"use client";

import { useChat, type UseChatOptions } from "ai/react";

import { Chat } from "@/components/ui/chat";

import { MessageCircleMoreIcon, PhoneCall, PhoneMissed } from "lucide-react";
import {
  GooeyMenu,
  GooeyMenuAfter,
  GooeyMenuBefore,
  GooeyMenuTrigger,
} from "./gooey/gooey-menu-floating";
import { DialogReused } from "./dialog-reused";

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"];
};

export const FloatingButton = () => {
  const iconStyle =
    "size-6 hover:scale-125 transition-transform duration-300 ease-in-out";

  const props = {
    initialMessages: [],
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  } = useChat(props);

  const SpaceChat = () => {
    return (
      <Chat
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isGenerating={isLoading}
        stop={stop}
      />
    );
  };

  return (
    <GooeyMenu
      className="fixed -bottom-12 -right-32 z-20 "
      direction="horizontal"
    >
      <GooeyMenuBefore>
        <DialogReused
          trigger={<PhoneCall className={iconStyle} />}
          description={"Call Us"}
          title={"Call Us"}
          content={<SpaceChat />}
        />

        <PhoneMissed className={iconStyle} />
      </GooeyMenuBefore>

      <GooeyMenuTrigger>
        <MessageCircleMoreIcon size={30} />
      </GooeyMenuTrigger>
    </GooeyMenu>
  );
};
