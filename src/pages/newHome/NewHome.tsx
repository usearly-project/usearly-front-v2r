import React, { useCallback } from "react";
import "./NewHome.scss";
import BrandCard from "./card/BrandCard";
import Footer from "@src/components/layout/Footer";
import VideoContainerLanding from "./components/videoContainer/videoContainerLanding";
import ExtensionExample from "./components/extensionExample/ExtensionExample";
import UsearlyDrawing from "@src/components/background/Usearly";
import HeroSection from "./components/heroSection/HeroSection";
import ScrollInlineImages from "./components/scroll-text/ScrollInlineImages";
// import FavoriteSection from "./components/slide-stack/FavoriteSection";
import InfiniteCarouselBanner from "./components/infiniteCarouselBanner/InfiniteCarouselBanner";
import { useIsAtBottom } from "@src/hooks/detect-bottom";

const BOTTOM_THRESHOLD_PX = 12;

const NewHome: React.FC = () => {
  const isAtBottom = useIsAtBottom(BOTTOM_THRESHOLD_PX);
  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="new-home-page">
      <HeroSection />
      <section className="new-home-video-section">
        <VideoContainerLanding />
      </section>

      <div className="new-home-main">
        <ExtensionExample />

        <InfiniteCarouselBanner />

        <div className="scroll-section">
          <ScrollInlineImages
            lines={[
              "NOUS CONNECTONS",
              "LES UTILISATEURS",
              "AUX MARQUES POUR CRÉER ENSEMBLE",
              "DES EXPÉRIENCES POSITIVES.",
            ]}
            images={[
              { line: 1, wordIndex: 1, src: "/assets/images/txt1.png" },
              { line: 3, wordIndex: 2, src: "/assets/images/txt2.png" },
              {
                line: 2,
                wordIndex: 2,
                src: "/assets/images/txt3.png",
                rotate: true,
              },
            ]}
          />
        </div>
      </div>
      {/* <div className="favorite-isolated">
        <FavoriteSection />
      </div> */}

      <div className="new-home-main">
        <BrandCard />
        <div className="usearly-drawing-container">
          <UsearlyDrawing animationDuration="25" />
        </div>
        <Footer />
      </div>

      {isAtBottom && (
        <button
          type="button"
          className="feedback-scroll-top-fab is-visible"
          onClick={scrollToTop}
          aria-label="Remonter en haut"
          title="Remonter en haut"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default NewHome;
