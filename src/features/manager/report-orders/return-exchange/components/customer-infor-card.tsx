import Image from "next/image";
import { User } from "lucide-react";
import { OrderReturnData } from "@/types/order-detail.types";
import { placeholderImage } from "@/utils/label";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";

interface CustomerInfoCardProps {
  user: OrderReturnData["user"];
}

export function CustomerInfoCard({ user }: CustomerInfoCardProps) {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-cyan-50 to-fuchsia-50 rounded-lg p-5 border cardStyle">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-white shadow-sm">
          <Image
            src={user?.avatar || placeholderImage}
            alt={user?.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <span className="text-sm text-slate-700 bg-white px-2 py-1 rounded-md border shadow-sm">
              {/* {user?.role} */}
              Khách hàng
            </span>
          </div>
          <div className="mt-1 flex flex-col sm:flex-row sm:items-center font-semibold  underline gap-x-4 text-sm">
            <div className="flex items-center gap-1">
              <User className="size-5 text-green-600 " />
              {user?.email}
            </div>
            {user?.phone && (
              <div className="flex items-center gap-1">
                <User className="size-5 text-green-600" />
                {formatVietnamesePhoneNumber(user?.phone)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
