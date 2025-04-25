import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { BadgePercent, TicketPercentIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoucherStore, Voucher } from "@/hooks/use-vouchers-store";
import { AnimatePresence, motion } from "framer-motion";
import { formatVND } from "@/lib/format-currency";
import React from "react";

interface VoucherPopoverProps {
  setSelectVoucher?: React.Dispatch<React.SetStateAction<Voucher | undefined>>;

  totalBeforeVoucher?: number;
}
export const VoucherPopover = ({
  setSelectVoucher,
  totalBeforeVoucher = 0,
}: VoucherPopoverProps) => {
  const { selectedVouchers, removeVoucher } = useVoucherStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative inline-flex text-sm h-11 w-10 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer">
          <div className="relative">
            <TicketPercentIcon
              className="size-5 mr-1 relative motion-preset-seesaw
            motion-rotate-in-[0.5turn]
"
            />
            <span
              className="
            absolute
            -top-2.5
            -right-2.5
            w-4
            h-4
            bg-primary-500
            text-slate-900
            rounded-full
            flex items-center justify-center
            "
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={selectedVouchers?.length} // Cập nhật animation mỗi khi cart.length thay đổi
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="font-semibold"
                >
                  {/* {cart?.length} */}
                  {selectedVouchers.length}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[360px] p-4">
        <h4 className="text-lg font-semibold mb-2">Voucher đã chọn</h4>
        {selectedVouchers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có voucher nào!</p>
        ) : (
          <ul className="space-y-4">
            {selectedVouchers.map((voucher) => {
              const isValid = totalBeforeVoucher >= voucher.minimumOrderAmount;

              return (
                <li
                  key={voucher.id}
                  className="flex items-start gap-3 rounded-xl border p-3 bg-muted/30 relative"
                >
                  <div className="mt-1 text-primary">
                    <BadgePercent size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700 text-base">
                      {voucher.name}
                    </p>
                    <p className="text-xs text-sky-500 font-medium">
                      {voucher.discountType === "Percentage"
                        ? `Giảm ${voucher.value}% (tối đa ${voucher.maximumDiscountAmount}k)`
                        : `Giảm ${formatVND(voucher.value)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đơn tối thiểu: {formatVND(voucher.minimumOrderAmount)}
                    </p>

                    <div className="mt-2 flex gap-2 items-center">
                      <Button
                        size="sm"
                        disabled={!isValid}
                        onClick={() => isValid && setSelectVoucher?.(voucher)}
                      >
                        Dùng ngay
                      </Button>

                      {!isValid && (
                        <span className="text-[10px] text-red-500 font-medium">
                          Chưa đủ điều kiện
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVoucher(voucher.id)}
                  >
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
      {/* <PopoverContent className="w-[320px] p-4">
        <h4 className="text-lg font-semibold mb-2">Voucher đã chọn</h4>
        {selectedVouchers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có voucher nào!</p>
        ) : (
          <ul className="space-y-3">
            {selectedVouchers.map((voucher) => (
              <li
                key={voucher.id}
                className="flex items-start gap-3 rounded-xl border p-3 bg-muted/30"
              >
                <div className="mt-1 text-primary">
                  <BadgePercent size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-700 text-lg">
                    {voucher.name}
                  </p>
                  <p className="text-xs text-sky-500 font-semibold">
                    {voucher.discountType === "Percentage"
                      ? `Giảm ${voucher.value}% (tối đa ${voucher.maximumDiscountAmount}k)`
                      : `Giảm ${formatVND(voucher.value)}`}
                  </p>
                  <p className="text-xs text-sky-500 font-semibold">
                    Đơn tối thiểu: {formatVND(voucher.minimumOrderAmount)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVoucher(voucher.id)}
                >
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent> */}
    </Popover>
  );
};
