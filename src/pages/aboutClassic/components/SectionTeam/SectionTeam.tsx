import { useEffect, useRef, useState } from "react";
import "./SectionTeam.scss";

const TEAM_MEMBERS = [
  {
    name: "Sylvain",
    poste: "Founder CEO",
    image: "/assets/images/about/UsearlyTeam/Sylvain.svg",
  },
  {
    name: "Gregory",
    poste: "Founder CEO",
    image: "/assets/images/about/UsearlyTeam/Gregory.svg",
  },
  {
    name: "Elsa",
    poste: "Product Designer",
    image: "/assets/images/about/UsearlyTeam/Christine.svg",
  },
  {
    name: "Roose",
    poste: "Dev Full-Stack",
    image: "/assets/images/about/UsearlyTeam/Roose.svg",
  },
  {
    name: "Alex",
    poste: "Dev Front",
    image: "/assets/images/about/UsearlyTeam/Alex.svg",
  },
  {
    name: "Enzo",
    poste: "Chargé de stratégie digitale",
    image: "/assets/images/about/UsearlyTeam/Enzo.svg",
  },
];

const SectionTeam = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      {
        threshold: 1,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`section-team${isVisible ? " is-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="section-team-header">
        <p className="section-team-eyebrow">Qui se cache derrière Usearly ?</p>
      </div>
      <div className="section-team-title">
        <h2 className="Raleway">
          6 passionnés engagés pour faire avancer un projet qui a du sens
        </h2>
      </div>
      <div className="section-team-gallery" aria-label="Équipe Usearly">
        {TEAM_MEMBERS.map((member) => (
          <figure className="section-team-member" key={member.name}>
            <div className="section-team-member-portrait">
              <img
                src={member.image}
                alt={`Photo de ${member.name}`}
                loading="lazy"
              />
            </div>
            <figcaption className="section-team-member-name">
              {member.name}
              <br />
              {member.poste}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default SectionTeam;
