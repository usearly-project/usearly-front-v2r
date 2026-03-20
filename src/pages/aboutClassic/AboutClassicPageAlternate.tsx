import { useEffect, useRef } from "react";
import "./AboutClassicPageAlternate.scss";
import Hero from "./components/Hero";
import SplitSection from "./components/SplitSection";
import MarqueeBanner from "./components/MarqueeBanner";
import ManifestoSection from "./components/ManifestoSection";
import TitleSection from "@src/pages/aboutClassic/components/TitleSection";
import useScrollPhrase from "@src/pages/aboutClassic/hooks/useScrollPhrase";
// import SectionTeam from "./components/SectionTeam/SectionTeam";
import FooterWord from "./components/FooterWord";
import Footer from "@src/components/layout/Footer";

const PHRASES = ["des sondages", "des chatbots", "le silence"];
const SCROLL_STEP = 0.05;

const AboutClassicPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const phraseIndex = useScrollPhrase(sectionRef, PHRASES.length, SCROLL_STEP);

  useEffect(() => {
    document.body.classList.add("page-about-classic");
    const main = document.querySelector("main");
    main?.classList.add("main--about-classic");
    return () => {
      main?.classList.remove("main--about-classic");
      document.body.classList.remove("page-about-classic");
    };
  }, []);

  return (
    <section className="about-classic">
      <Hero page={"about"} />
      <TitleSection phrase={PHRASES[phraseIndex]} />
      <SplitSection sectionRef={sectionRef} />
      <MarqueeBanner />
      <ManifestoSection />
      {/* <SectionTeam /> */}
      <FooterWord />
      <Footer />
    </section>
  );
};

export default AboutClassicPage;
