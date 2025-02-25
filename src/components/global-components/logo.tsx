import { cn } from "@/lib/utils";
import Image from "next/image";
import { TextShimmerWave } from "../custom/_customize-text/text-shummer-wave";
import Link from "next/link";

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
    <Link href={"/"} className="flex flex-col items-center ">
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
        <TextShimmerWave
          spread={0.3}
          rotateYDistance={5}
          className="text-black"
        >
          ThaiFruitz
        </TextShimmerWave>
      </h1>
    </Link>
  );
};
