import "./SectionJoinUsearly.scss";
import type { ReactNode } from "react";
import clapHandStars from "/assets/icons/clap-hand-stars.svg";
import holdingThunder from "/assets/icons/holding-thunder.svg";
import earthSpin from "/assets/icons/earth-spin.svg";
import SectionJoinUsearlyFeatureBox from "./SectionJoinUsearlyFeatureBox";

type SectionJoinUsearlyFeature = {
  iconSrc: string;
  title: string;
  description: ReactNode;
  emphasizeIcon?: boolean;
};

const features: SectionJoinUsearlyFeature[] = [
  {
    iconSrc: clapHandStars,
    emphasizeIcon: true,
    title: "Vous n’êtes plus seul face à un\u00A0problème",
    description: (
      <p>
        Voyez immédiatement si d’autres utilisateurs rencontrent la même
        expérience.
        <br /> <br />
        La communauté partage signalements, idées et solutions pour comprendre
        ce qui se passe et trouver une solution plus vite.
      </p>
    ),
  },
  {
    iconSrc: holdingThunder,
    title: "Faites bouger les\u00A0marques",
    description: (
      <p>
        Vos feedbacks prennent de la force ensemble. <br /> <br />
        Signalez un problème, proposez une idée ou soutenez celles des autres
        pour faire évoluer les sites et applications.
      </p>
    ),
  },
  {
    iconSrc: earthSpin,
    title: "Visualisez l’impact de la\u00A0communauté",
    description: (
      <p>
        Suivez comment les marques réagissent et améliorent leurs services.{" "}
        <br /> <br />
        Recevez une notification lorsque les choses avancent : réponse de la
        marque, solution trouvée ou évolution du signalement.
      </p>
    ),
  },
];

const SectionJoinUsearly = () => {
  return (
    <section className="section-join-usearly">
      <div className="section-join-usearly-header">
        <h2 className="section-join-usearly-header-title">
          Pourquoi <span>rejoindre la communauté</span> Usearly ?
        </h2>
      </div>
      <div className="section-join-usearly-features">
        {features.map((feature) => (
          <SectionJoinUsearlyFeatureBox
            key={feature.title}
            iconSrc={feature.iconSrc}
            title={feature.title}
            description={feature.description}
            emphasizeIcon={feature.emphasizeIcon}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionJoinUsearly;
