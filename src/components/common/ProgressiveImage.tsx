import { useEffect, useState } from "react";

type Props = {
  alt: string;
  thumbnailSrc?: string;
  highResSrc?: string;
  className?: string;
  loading?: "eager" | "lazy";
  delayMs?: number;
};

export default function ProgressiveImage({
  alt,
  thumbnailSrc,
  highResSrc,
  className = "",
  loading = "lazy",
  delayMs = 700,
}: Props) {
  const fallbackSrc = thumbnailSrc || highResSrc || "";
  const [src, setSrc] = useState(fallbackSrc);

  useEffect(() => {
    const nextFallback = thumbnailSrc || highResSrc || "";
    setSrc(nextFallback);

    if (!highResSrc || highResSrc === thumbnailSrc) return;

    let active = true;
    const timer = window.setTimeout(() => {
      const img = new Image();
      img.src = highResSrc;
      img.onload = () => {
        if (!active) return;
        setSrc(highResSrc);
      };
    }, delayMs);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [thumbnailSrc, highResSrc, delayMs]);

  return <img src={src} alt={alt} loading={loading} className={className} />;
}

