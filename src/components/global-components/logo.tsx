import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-1 mr-2">
      <Image
        src="/images/dried-fruit.webp"
        alt="Picture of the author"
        width={50}
        height={50}
      />
      <h1 className="text-slate-700 font-serif italic">ThaiFruitz</h1>
    </div>
  );
};
