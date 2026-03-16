import { useState } from "react";
import { useIsMobile } from "@src/hooks/use-mobile";
import DesktopCarousel from "./DesktopCarousel";
import MobileCarousel from "./MobileCarousel";
import "./FavoriteCarouselSection.scss";

const TITLE_TEXT = [
  ["Les signalements", "qui ont le plus", "fait râler cette", "semaine 😅"],
  ["Les coups de ❤️", "que vous avez le", "plus aimés !"],
  ["Les suggestions", "qui vous font", "rêver ✨"],
];

const SECTION_THEME_CLASS = [
  "favorite-section--reports",
  "favorite-section--favorites",
  "favorite-section--suggestions",
];

export default function FavoriteCarouselSection() {
  const [slideIndex, setSlideIndex] = useState(0);
  const isMobile = useIsMobile("(max-width: 900px)");
  const currentThemeClass =
    SECTION_THEME_CLASS[slideIndex] ?? SECTION_THEME_CLASS[0];

  return (
    <section className={`favorite-section ${currentThemeClass}`}>
      <div className="favorite-wrapper">
        <div className="favorite-left">
          <h2 key={slideIndex} className="favorite-title">
            {TITLE_TEXT[slideIndex].map((line, i) => (
              <span
                key={i}
                className="title-line"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {line}
              </span>
            ))}
          </h2>

          {!isMobile && <button className="favorite-button">Découvrir</button>}
        </div>

        <div className="favorite-right">
          {isMobile ? (
            <MobileCarousel onSlideChange={setSlideIndex} />
          ) : (
            <DesktopCarousel onSlideChange={setSlideIndex} />
          )}
        </div>

        {isMobile && <button className="favorite-button">Découvrir</button>}
      </div>
    </section>
  );
}
