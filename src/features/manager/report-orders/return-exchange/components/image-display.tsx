import Image from "next/image";
import { FileText } from "lucide-react";
import ImagePreview from "@/components/custom/_custom-image/image-preview";
import { placeholderImage } from "@/utils/label";

interface ImageDisplayProps {
  src: string;
  alt: string;
  title: string;
}

export function ImageDisplay({ src, alt, title }: ImageDisplayProps) {
  return (
    <div className="mt-6 pt-4 border-t">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
        <FileText className="size-5 text-green-600" />
        {title}
      </h4>

      <ImagePreview
        images={[src]}
        alt={title + " - " + alt}
        className="relative h-48 w-full sm:w-1/2 md:w-1/3 overflow-hidden rounded-md border shadow-sm"
        // imageClassName="object-contain"
      />
      {/* <div className="relative h-48 w-full sm:w-1/2 md:w-1/3 overflow-hidden rounded-md border shadow-sm">
        <Image
          src={src || placeholderImage}
          alt={alt}
          fill
          className="object-contain"
        />
      </div> */}
    </div>
  );
}
