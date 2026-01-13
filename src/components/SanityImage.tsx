import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/lib/types";

interface SanityImageProps {
  value: SanityImageType;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
}

export function SanityImage({
  value,
  width = 800,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
}: SanityImageProps) {
  if (!value?.asset) return null;

  const calculatedHeight = height || Math.round(width / 1.5);

  if (fill) {
    return (
      <Image
        className={className}
        src={urlFor(value).width(width * 2).url()}
        alt={value.alt || ""}
        fill
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={value.asset.metadata?.lqip}
      />
    );
  }

  return (
    <Image
      className={className}
      src={urlFor(value).width(width).height(calculatedHeight).url()}
      alt={value.alt || ""}
      width={width}
      height={calculatedHeight}
      priority={priority}
      placeholder={value.asset.metadata?.lqip ? "blur" : "empty"}
      blurDataURL={value.asset.metadata?.lqip}
    />
  );
}

