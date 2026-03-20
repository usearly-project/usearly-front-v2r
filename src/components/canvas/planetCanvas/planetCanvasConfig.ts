import reportIcon from "/assets/icons/reportYellowIcon.svg";
import heartIcon from "/assets/icons/cdc-icon.svg";
import suggestionIcon from "/assets/icons/suggest-icon.svg";
import { pickRandomValue } from "./planetCanvasUtils";
import type {
  PlanetPopFeedBrandConfig,
  PlanetPopFeedBrandMessage,
  PlanetPopFeedThemeConfig,
  PopFeedTheme,
} from "./types";

export const PLANET_CANVAS_TRAIL_IMAGES = Array.from(
  { length: 13 },
  (_, index) => `/assets/images/about/imageAbout${index + 1}.png`,
);

export const POP_FEED_LIFETIME_MS = 5000;
export const POP_FEED_MAX_ATTEMPTS = 12;

export const POP_FEED_BRANDS = [
  {
    id: "nike",
    label: "Nike",
    image: "/assets/brandLogo/nike.png",
    copy: {
      report: "Le choix de taille bugue souvent.",
      reportLinked: "Même souci ici, le sélecteur m'a bloqué aussi.",
      suggestion: [
        "Ce serait bien qu'il y ait un guide de tailles plus visuel.",
        "J'aimerais que les différences entre les coupes soient mieux affichées.",
        "Ce serait top qu'il y ait un vrai comparateur de tailles.",
      ],
      coupDeCoeur: [
        "J'aime les visuels produit.",
        "J'adore quand les détails des sneakers sont bien montrés.",
        "Trop bien, les pages produit donnent envie.",
      ],
    },
  },
  {
    id: "boursorama",
    label: "Boursorama",
    image: "/assets/brandLogo/bourso.png",
    copy: {
      report: "La connexion saute parfois.",
      reportLinked: "Même friction ici, j'ai dû relancer l'app.",
      suggestion: [
        "J'aimerais qu'il y ait un solde plus synthétique.",
        "Ce serait bien que les dépenses du mois soient mieux résumées.",
        "Ce serait top que les infos clés soient plus mises en avant.",
      ],
      coupDeCoeur: [
        "J'adore la vue des comptes.",
        "J'aime la lisibilité du tableau de bord.",
        "Trop bien, les comptes sont faciles à parcourir.",
      ],
    },
  },
  {
    id: "airbnb",
    label: "Airbnb",
    image: "/assets/brandLogo/airbnd.png",
    copy: {
      report: "Les frais arrivent trop tard.",
      reportLinked: "Même ressenti ici, le total change trop tard.",
      suggestion: [
        "Ce serait top que les logements soient mieux comparés.",
        "J'aimerais que les frais soient visibles plus tôt.",
        "Ce serait bien que la comparaison entre plusieurs annonces soit plus simple.",
      ],
      coupDeCoeur: [
        "Trop bien, les filtres rassurent vite.",
        "J'aime la clarté des cartes.",
        "J'adore la façon dont on peut vite se projeter.",
      ],
    },
  },
  {
    id: "leboncoin",
    label: "leboncoin",
    image: "/assets/brandLogo/lbo.png",
    copy: {
      report: "La messagerie se désynchronise.",
      reportLinked: "Même bug ici, mes messages n'arrivent pas.",
      suggestion: [
        "J'aimerais qu'il y ait un historique de recherche.",
        "Ce serait bien que les filtres utilisés soient mieux mémorisés.",
        "Ce serait top qu'il y ait plus d'alertes personnalisées.",
      ],
      coupDeCoeur: [
        "J'aime que les fiches aillent droit au but.",
        "J'adore le côté direct des annonces.",
        "Trop bien, ça va à l'essentiel sans détour.",
      ],
    },
  },
  {
    id: "duolingo",
    label: "Duolingo",
    image: "/assets/brandLogo/duo.png",
    copy: {
      report: "Les rappels reviennent trop souvent.",
      reportLinked: "Même souci, les notifs repartent seules.",
      suggestion: [
        "Ce serait bien qu'ils proposent plus de révision ciblée.",
        "J'aimerais choisir les rappels plus finement.",
        "Ce serait top de mieux adapter les exercices aux erreurs.",
      ],
      coupDeCoeur: [
        "J'adore la progression.",
        "J'aime la sensation d'avancer vite.",
        "Trop bien, il me motive à revenir chaque jour.",
      ],
    },
  },
  {
    id: "instagram",
    label: "Instagram",
    image: "/assets/brandLogo/instagram.png",
    copy: {
      report: "Je peux pas recevoir mes messages...",
      reportLinked: "Moi aussi j’ai le même problème !",
      suggestion: [
        "J'aimerais que les DM non lus soient triés.",
        "Ce serait bien que le rangement des messages soit amélioré.",
        "Ce serait top que les conversations importantes soient mieux séparées.",
      ],
      coupDeCoeur: [
        "Trop bien, les transitions sont hyper fluides.",
        "J'aime la nervosité de l'interface.",
        "J'adore la fluidité des interactions.",
      ],
    },
  },
  {
    id: "ubereats",
    label: "Uber Eats",
    image: "/assets/brandLogo/uberEats.png",
    copy: {
      report: "Le suivi livreur saute parfois.",
      reportLinked: "Même souci ici, le tracking décroche.",
      suggestion: [
        "J’aimerais une estimation plus précise du temps de livraison...",
        "Ce serait top que les délais soient filtrés plus finement.",
        "Ce serait bien que les frais soient plus lisibles avant le panier.",
      ],
      coupDeCoeur: [
        "J'aime que le panier soit super lisible.",
        "J'adore la clarté du parcours de commande.",
        "Trop bien, ça va vite à l'essentiel.",
      ],
    },
  },
  {
    id: "spotify",
    label: "Spotify",
    image: "/assets/brandLogo/spotify.png",
    copy: {
      report: "La lecture change parfois d'appareil.",
      reportLinked: "Même bug ici, ça reprend sur le mauvais appareil.",
      suggestion: [
        "J'aimerais que les playlists soient triées par humeur.",
        "Ce serait bien que ça filtre mieux selon le moment de la journée.",
        "Ce serait top que les recommandations soient davantage expliquées.",
      ],
      coupDeCoeur: [
        "J'adore quand les recos tombent juste.",
        "J'aime la sensation de découverte.",
        "Trop bien, l'ambiance recherchée est souvent bien comprise.",
      ],
    },
  },
  {
    id: "netflix",
    label: "Netflix",
    image: "/assets/brandLogo/netflix.png",
    copy: {
      report: "La reprise d'épisode saute parfois.",
      reportLinked: "Même souci ici, la lecture repart mal parfois.",
      suggestion: [
        "Ce serait bien que ça filtre mieux selon la durée.",
        "J'aimerais que les formats courts et longs soient mieux distingués.",
        "Ce serait top qu'il y ait des suggestions plus rapides à choisir.",
      ],
      coupDeCoeur: [
        "J’adore la nouvelle fonctionnalité “Moments” !",
        "Trop bien, la home donne vite envie de lancer quelque chose.",
        "J'aime la façon dont les contenus sont mis en scène.",
        "J'adore quand on trouve vite quoi regarder.",
      ],
    },
  },
] as const satisfies readonly PlanetPopFeedBrandConfig[];

export const POP_FEED_THEME_CONFIG: Record<
  PopFeedTheme,
  PlanetPopFeedThemeConfig
> = {
  report: {
    icon: reportIcon,
    surface: "#4E8CFF",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
  },
  suggestion: {
    icon: suggestionIcon,
    surface: "#37D48B",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
  },
  coupDeCoeur: {
    icon: heartIcon,
    surface: "#A688FF",
    border: "rgba(255, 255, 255, 1)",
    shadow: "rgba(00, 00, 00, 0.5)",
  },
};

const FALLBACK_MESSAGE_BY_THEME: Record<PopFeedTheme, string> = {
  report: "Il y a encore un point de friction ici.",
  suggestion: "Ce serait bien qu'il y ait une petite amélioration ici.",
  coupDeCoeur: "J'aime vraiment ce détail.",
};

const resolveBrandMessage = (
  message: PlanetPopFeedBrandMessage | undefined,
  fallback: string,
) => {
  if (!message) {
    return fallback;
  }

  return typeof message === "string" ? message : pickRandomValue(message);
};

export const buildPopFeedBrandMessage = (
  brand: PlanetPopFeedBrandConfig,
  theme: PopFeedTheme,
  options?: {
    linked?: boolean;
  },
) => {
  if (theme === "report" && options?.linked) {
    return resolveBrandMessage(
      brand.copy.reportLinked ?? brand.copy.report,
      FALLBACK_MESSAGE_BY_THEME.report,
    );
  }

  return resolveBrandMessage(
    brand.copy[theme],
    FALLBACK_MESSAGE_BY_THEME[theme],
  );
};
