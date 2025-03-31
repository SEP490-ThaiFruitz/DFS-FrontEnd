import Link from "next/link";
import { ChevronRight, House, Library, PackageSearch } from "lucide-react";

interface BreadcrumbProps {
  productName: string;
}

export default function Breadcrumb({ productName }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-slate-800 mb-6 pt-14">
      <Link
        href="/"
        className="hover:text-slate-900 hover:underline transition duration-300 cursor-pointer font-semibold flex items-center gap-1"
      >
        <House className="size-4" />
        Trang chủ
      </Link>
      <ChevronRight className="h-4 w-4 mx-2" />
      <Link
        href="/"
        className="hover:text-slate-900 hover:underline transition duration-300 cursor-pointer font-semibold flex items-center gap-1"
      >
        <Library className="size-4" />
        Chi tiết sản phẩm
      </Link>
      <ChevronRight className="h-4 w-4 mx-2" />
      <span className="hover:text-slate-900 hover:underline transition duration-300 cursor-pointer font-semibold flex items-center gap-1">
        <PackageSearch className="size-4" />
        {productName}
      </span>
    </nav>
  );
}
