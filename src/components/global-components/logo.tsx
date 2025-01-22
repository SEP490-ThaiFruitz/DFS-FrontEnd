import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  classNameLabel?: string;
  height?: number;
  width?: number;
}
export const Logo = ({
  classNameLabel,
  height = 50,
  width = 50,
}: LogoProps) => {
  return (
    <div className="flex flex-col items-center ">
      <Image
        src="/images/dried-fruit.webp"
        alt="Picture of the author"
        width={width}
        height={height}
      />
      <h1
        className={cn(
          "text-slate-700 text-base font-serif italic",
          classNameLabel
        )}
      >
        ThaiFruitz
      </h1>
    </div>
  );
};
