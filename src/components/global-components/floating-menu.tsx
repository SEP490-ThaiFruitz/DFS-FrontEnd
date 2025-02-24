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
import { useState } from "react";

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
        // stop={stop}
      />
    );
  };

  return (
    <GooeyMenu
      className="fixed h-10 w-10 bottom-28 right-10 z-20 "
      direction="horizontal"
    >
      <GooeyMenuBefore>
        <DialogReused
          trigger={<PhoneCall onClick={() => setIsOpen(true)} className={iconStyle} />}
          description={"Call Us"}
          title={"Call Us"}
          content={<SpaceChat />}
          open={isOpen}
          onClose={setIsOpen}
        />

        <PhoneMissed className={iconStyle} />
      </GooeyMenuBefore>

      <GooeyMenuTrigger>
        <MessageCircleMoreIcon size={25} />
      </GooeyMenuTrigger>
    </GooeyMenu>
  );
};
