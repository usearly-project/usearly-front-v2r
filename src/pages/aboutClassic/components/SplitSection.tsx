import { type ReactNode, type RefObject } from "react";
// import PlanetCanvas from "@src/components/canvas/PlanetCanvas";

type SplitSectionProps = {
  sectionRef: RefObject<HTMLDivElement | null>;
};

type CardContent = {
  id: string;
  className?: string;
  content: ReactNode;
};

const CARDS: CardContent[] = [
  {
    id: "frustration",
    content: (
      <>
        <span className="about-classic__card-description">
          Usearly répond à une frustration très largement partagée{" "}
        </span>
        <span className="about-classic__card-description--highlight">
          On ne peut pas signaler un bug ou un irritant sur un site internet ou
          une application mobile, au moment où on le rencontre. On ne peut pas
          suggérer une idée d'amélioration qu'on a vue ailleurs et qui
          améliorerait notre utilisation. On doit intérioriser nos émotions. Ce
          qui crée une distance avec les marques.
        </span>
      </>
    ),
  },
  {
    id: "mission",
    className: "about-classic__card--offset",
    content: (
      <>
        <span className="about-classic__card-description">
          Notre mission : permettre aux utilisateurs de s'exprimer partout et
          sur tout.{" "}
        </span>{" "}
        Avec Usearly, nous proposons une alternative aux sondages réducteurs,
        aux avis Google et à l'ultime recours des réseaux sociaux pour se faire
        entendre. Signalez un problème ou proposez une idée en toute simplicité.
        Et grâce à la communauté Usearly vous obtenez du soutien et des
        solutions à vos blocages en temps réel.
      </>
    ),
  },
];

const SplitSection = ({ sectionRef }: SplitSectionProps) => (
  <div
    className="about-classic__section about-classic__section--split"
    ref={sectionRef}
  >
    <Cards />
    {/* <div className="about-classic__statement">
      <PlanetCanvas />
    </div> */}
  </div>
);

const Cards = () => (
  <div className="about-classic__cards">
    {CARDS.map((card) => (
      <article
        className={`about-classic__card${card.className ? ` ${card.className}` : ""}`}
        key={card.id}
      >
        <p className="Raleway">{card.content}</p>
      </article>
    ))}
  </div>
);

export default SplitSection;
