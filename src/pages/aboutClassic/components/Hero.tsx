import { useEffect, useState } from "react";

const SCROLL_HINT_TEXT = "Faites défiler pour découvrir la suite";

type Props = {
  page: "landing" | "about";
};

const Hero = ({ page }: Props) => {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [allowTyping, setAllowTyping] = useState(true);

  useEffect(() => {
    const updateScrollHint = () => {
      const shouldShow = window.scrollY <= 8;
      setShowScrollHint((current) =>
        current === shouldShow ? current : shouldShow,
      );
    };

    updateScrollHint();
    window.addEventListener("scroll", updateScrollHint, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollHint);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setAllowTyping(!media.matches);

    updatePreference();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updatePreference);
      return () => media.removeEventListener("change", updatePreference);
    }

    media.addListener(updatePreference);
    return () => media.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    if (!allowTyping) {
      setTypedText(SCROLL_HINT_TEXT);
      setIsDeleting(false);
      return;
    }

    const fullText = SCROLL_HINT_TEXT;
    let timeoutId = 0;

    if (!isDeleting) {
      if (typedText.length < fullText.length) {
        timeoutId = window.setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, 70);
      } else {
        timeoutId = window.setTimeout(() => setIsDeleting(true), 1200);
      }
    } else if (typedText.length > 0) {
      timeoutId = window.setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length - 1));
      }, 45);
    } else {
      timeoutId = window.setTimeout(() => setIsDeleting(false), 550);
    }

    return () => window.clearTimeout(timeoutId);
  }, [allowTyping, isDeleting, typedText]);

  return (
    <div className="about-classic__hero">
      {page === "landing" && (
        <iframe
          className="about-classic__hero-video"
          src="https://www.youtube.com/embed/FkAnIL1l4wo?autoplay=1&mute=1&loop=1&playlist=FkAnIL1l4wo&controls=0&modestbranding=1"
          title="Usearly video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
      {page === "about" && (
        <iframe
          className="about-classic__hero-video"
          src="https://www.youtube.com/embed/QmFQRhUOns4?autoplay=1&mute=1&loop=1&playlist=QmFQRhUOns4&controls=0&modestbranding=1&playsinline=1"
          title="Usearly video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
      <div
        className={`about-classic__scroll-indicator${
          showScrollHint ? "" : " is-hidden"
        }`}
        aria-hidden={!showScrollHint}
      >
        <span className="about-classic__scroll-text Raleway">
          <span className="about-classic__scroll-text-inner">{typedText}</span>
        </span>
        <span className="about-classic__scroll-icon" aria-hidden="true">
          <span className="about-classic__scroll-wheel" />
        </span>
      </div>
    </div>
  );
};

export default Hero;
