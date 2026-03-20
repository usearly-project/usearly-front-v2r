import { useEffect, useId, useState } from "react";

type AnimatedExtensionLandingSlideProps = {
  src: string;
  alt: string;
  className?: string;
};

const slideMarkupCache = new Map<string, string>();

const replaceEvery = (source: string, search: string, replacement: string) => {
  return source.split(search).join(replacement);
};

const scopeSvgMarkup = (svgMarkup: string, scopeId: string) => {
  if (
    typeof DOMParser === "undefined" ||
    typeof XMLSerializer === "undefined"
  ) {
    return svgMarkup;
  }

  try {
    const parser = new DOMParser();
    const document = parser.parseFromString(svgMarkup, "image/svg+xml");
    const svgElement = document.documentElement;
    const elementsWithIds = Array.from(svgElement.querySelectorAll("[id]"));

    if (!elementsWithIds.length) {
      return svgMarkup;
    }

    const idMap = new Map<string, string>();

    elementsWithIds.forEach((element, index) => {
      const currentId = element.getAttribute("id");
      if (!currentId) return;

      const scopedElementId = `${scopeId}-${currentId}-${index}`;
      idMap.set(currentId, scopedElementId);
      element.setAttribute("id", scopedElementId);
    });

    let scopedMarkup = new XMLSerializer().serializeToString(svgElement);

    idMap.forEach((scopedElementId, currentId) => {
      scopedMarkup = replaceEvery(
        scopedMarkup,
        `url(#${currentId})`,
        `url(#${scopedElementId})`,
      );
      scopedMarkup = replaceEvery(
        scopedMarkup,
        `="#${currentId}"`,
        `="#${scopedElementId}"`,
      );
      scopedMarkup = replaceEvery(
        scopedMarkup,
        `='#${currentId}'`,
        `='#${scopedElementId}'`,
      );
    });

    return scopedMarkup;
  } catch {
    return svgMarkup;
  }
};

const AnimatedExtensionLandingSlide = ({
  src,
  alt,
  className,
}: AnimatedExtensionLandingSlideProps) => {
  const scopeId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [markup, setMarkup] = useState(() => {
    const cachedMarkup = slideMarkupCache.get(src);
    return cachedMarkup ? scopeSvgMarkup(cachedMarkup, scopeId) : "";
  });

  useEffect(() => {
    let isCancelled = false;

    const cachedMarkup = slideMarkupCache.get(src);
    if (cachedMarkup) {
      setMarkup(scopeSvgMarkup(cachedMarkup, scopeId));
      return;
    }

    setMarkup("");

    const loadMarkup = async () => {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Unable to load SVG: ${src}`);

        const svgMarkup = await response.text();
        slideMarkupCache.set(src, svgMarkup);

        if (!isCancelled) {
          setMarkup(scopeSvgMarkup(svgMarkup, scopeId));
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
  }, [scopeId, src]);

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
