import React, { useCallback, useRef } from "react";
import "./NewHomeAlternatif.scss";
import UsearlyFooter from "@src/components/layout/UsearlyFooter";
// import TitleSection from "@src/pages/aboutClassic/components/TitleSection";
import ExtensionExample from "./components/extensionExample/ExtensionExample";
// import Hero from "@src/pages/aboutClassic/components/Hero";
import SectionHookUsers from "./components/sectionHookUsers/SectionHookUsers";
import ScrollInlineImages from "./components/scroll-text/ScrollInlineImages";
import InfiniteCarouselBanner from "./components/infiniteCarouselBanner/InfiniteCarouselBanner";
// import useScrollPhrase from "@src/pages/aboutClassic/hooks/useScrollPhrase";
import ExtensionRedirect from "@src/components/extension-redirect/ExtensionRedirect";
import { useIsAtBottom } from "@src/hooks/detect-bottom";
import FavoriteCarouselSection from "./components/slide-stack/FavoriteCarouselSection";
import SectionJoinUsearly from "@src/pages/newHome/components/sectionJoinUsearly/SectionJoinUsearly";

// const PHRASES = ["des sondages", "des chatbots", "le silence"];
// const SCROLL_STEP = 0.05;
const BOTTOM_THRESHOLD_PX = 12;

const NewHome: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  // const phraseIndex = useScrollPhrase(sectionRef, PHRASES.length, SCROLL_STEP);
  const isAtBottom = useIsAtBottom(BOTTOM_THRESHOLD_PX);
  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="new-home-page">
      {/* <Hero page={"landing"} />
       */}
      <SectionHookUsers />
      <SectionJoinUsearly />
      {/* <TitleSection phrase={PHRASES[phraseIndex]} /> */}

      {/* --- SECTION NORMALE --- */}
      <div className="new-home-main" ref={sectionRef}>
        <ExtensionExample />

        <InfiniteCarouselBanner />

        <ExtensionRedirect />

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
              { line: 3, wordIndex: 2, src: "/assets/images/txt2.svg" },
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

      {/* --- SUITE DU CONTENU (NON AFFECTÉ) --- */}
      <div className="new-home-main">
        <FavoriteCarouselSection />
        {/* <BrandCard /> */}
        <UsearlyFooter />
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
