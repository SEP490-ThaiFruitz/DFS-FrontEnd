import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Voucher {
  id: string;
  name: string;

  code: string;

  image: string | null;
  value: number;
  discountType: string;
  startDate: string;
  endDate: string;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  quantity: number;
}

interface VoucherState {
  selectedVouchers: Voucher[];
}

interface VoucherActions {
  addVoucher: (voucher: Voucher) => void;
  removeVoucher: (voucherId: string) => void;
  clearVouchers: () => void;
}

const INITIAL_STATE: VoucherState = {
  selectedVouchers: [],
};

export const useVoucherStore = create(
  persist<VoucherState & VoucherActions>(
    (set, get) => ({
      selectedVouchers: INITIAL_STATE.selectedVouchers,

      addVoucher: (voucher: Voucher) => {
        const current = get().selectedVouchers;
        const alreadyExists = current.find((v) => v.id === voucher.id);
        // if (!alreadyExists) {
        //   set({ selectedVouchers: [...current, voucher] });
        // }

        if (!alreadyExists) {
          set({ selectedVouchers: [...current, voucher] });
          toast.success(`Đã thêm ${voucher.name} được lưu!`);
        } else {
          toast.warning(`${voucher.name} đã được thêm.`);
        }
      },

      removeVoucher: (voucherId: string) => {
        const voucher = get().selectedVouchers.find((v) => v.id === voucherId);
        const updated = get().selectedVouchers.filter(
          (v) => v.id !== voucherId
        );
        set({ selectedVouchers: updated });

        toast.info(`Đã xoá voucher${voucher ? `: ${voucher.name}` : ""}`);
      },

      clearVouchers: () => {
        set({ selectedVouchers: [] });

        toast.success("Đã xoá toàn bộ voucher khỏi đơn hàng.");
      },
    }),
    {
      name: "thai-fruiz-vouchers",
      version: 1,
    }
  )
);
