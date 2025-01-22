import { MessageCircleMoreIcon, PhoneCall, PhoneMissed } from "lucide-react";
import {
  GooeyMenu,
  GooeyMenuAfter,
  GooeyMenuBefore,
  GooeyMenuTrigger,
} from "./gooey/gooey-menu-floating";

export const FloatingButton = () => {
  const iconStyle =
    "size-6 hover:scale-125 transition-transform duration-300 ease-in-out";

  return (
    <GooeyMenu
      className="fixed -bottom-12 -right-32 z-20 "
      direction="horizontal"
    >
      <GooeyMenuBefore>
        <PhoneCall className={iconStyle} />
        <PhoneMissed className={iconStyle} />
      </GooeyMenuBefore>

      <GooeyMenuTrigger>
        <MessageCircleMoreIcon size={30} />
      </GooeyMenuTrigger>
    </GooeyMenu>
  );
};
