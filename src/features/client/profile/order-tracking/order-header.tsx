import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { Button } from "@/components/ui/button";
import { ScrollTextIcon, Plane, Package } from "lucide-react";

export const OrderHeader = () => {
  return (
    // <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 space-y-4">
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <AdvancedColorfulBadges color="green" className="mb-2">
            Delivering
          </AdvancedColorfulBadges>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Order Id: OR12C31
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-none"
          >
            <ScrollTextIcon className="w-4 h-4 mr-1" /> Hoá Đơn
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-none"
          >
            <ScrollTextIcon className="w-4 h-4 mr-1" /> In
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-2 sm:gap-4 text-indigo-100">
        <span className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Ngày mua: 22-02-2025
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="flex items-center gap-1">
          <Plane className="w-4 h-4" /> Ước tính vận chuyển: 25-02-2025
        </span>
      </div>
    </div>
  );
};
