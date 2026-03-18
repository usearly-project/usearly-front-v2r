import { useEffect, useRef } from "react";
import "./AboutClassicPageAlternate.scss";
import Hero from "./components/Hero";
import SplitSection from "./components/SplitSection";
import MarqueeBanner from "./components/MarqueeBanner";
import ManifestoSection from "./components/ManifestoSection";
import SectionTeam from "./components/SectionTeam/SectionTeam";
import FooterWord from "./components/FooterWord";
import Footer from "@src/components/layout/Footer";

const AboutClassicPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);

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
      <SplitSection sectionRef={sectionRef} />
      <MarqueeBanner />
      <ManifestoSection />
      <SectionTeam />
      <FooterWord />
      <Footer />
    </section>
  );
};

export default AboutClassicPage;
