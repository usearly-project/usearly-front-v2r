import { useEffect, useState } from "react";

type AnimatedExtensionLandingSlideProps = {
  src: string;
  alt: string;
  className?: string;
};

const slideMarkupCache = new Map<string, string>();

const AnimatedExtensionLandingSlide = ({
  src,
  alt,
  className,
}: AnimatedExtensionLandingSlideProps) => {
  const [markup, setMarkup] = useState(() => slideMarkupCache.get(src) ?? "");

  useEffect(() => {
    let isCancelled = false;

    const cachedMarkup = slideMarkupCache.get(src);
    if (cachedMarkup) {
      setMarkup(cachedMarkup);
      return;
    }

    const loadMarkup = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Unable to load SVG: ${src}`);

        const svgMarkup = await response.text();
        slideMarkupCache.set(src, svgMarkup);

        if (!isCancelled) {
          setMarkup(svgMarkup);
        }
      } catch {
        if (!isCancelled) {
          setMarkup("");
        }
      }
    };

    void loadMarkup();

    return () => {
      isCancelled = true;
    };
  }, [src]);

  if (!markup) {
    return <img src={src} alt={alt} draggable={false} className={className} />;
  }

  return (
    <span
      className={className}
      role="img"
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
};

export default AnimatedExtensionLandingSlide;
