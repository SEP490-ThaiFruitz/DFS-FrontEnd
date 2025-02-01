import { Logo } from "@/components/global-components/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingBagIcon } from "lucide-react";

export const ShoppingBagSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative inline-flex text-sm h-11 w-28 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer">
          <ShoppingBagIcon className="size-4 mr-1 relative" />
          <span
            className="
            absolute
            -top-1
            -right-1
            w-4
            h-4
            bg-primary-500
            text-slate-900
            rounded-full
            flex items-center justify-center
          "
          >
            0
          </span>
        </div>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="text-center">
              <Logo />
            </div>
          </SheetTitle>
          <SheetDescription>
            <span className="text-center">Your shopping bag is empty</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-center">
          <div className="flex justify-center">
            <div>Add some items</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
