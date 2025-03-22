import { cn } from "@/lib/utils";
import Image from "next/image";
import { TextShimmerWave } from "../custom/_customize-text/text-shummer-wave";
import Link from "next/link";

interface LogoProps {
  classNameLabel?: string;
  height?: number;
  width?: number;

  className?: string;

  isTextHidden?: boolean;
}
export const Logo = ({
  classNameLabel,
  height = 50,
  width = 50,
  className,

  isTextHidden,
}: LogoProps) => {
  return (
    <Link
      href={"/"}
      className={cn("hidden md:flex flex-col items-center ", className)}
    >
      <Image
        src="/images/dried-fruit.webp"
        alt="the logo of the website"
        width={width}
        height={height}
      />
      {!isTextHidden && (
        <h1
          className={cn(
            "text-slate-700 text-base font-serif italic",
            classNameLabel
          )}
        >
          <TextShimmerWave
            spread={0.3}
            rotateYDistance={5}
            className="text-black italic"
          >
            ThaiFruitz
          </TextShimmerWave>
        </h1>
      )}
    </Link>
  );
};
