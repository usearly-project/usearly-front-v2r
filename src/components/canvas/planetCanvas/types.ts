export type PopFeedTheme = "report" | "suggestion" | "coupDeCoeur";
export type PopFeedVariant = "default" | "pastel";

export type PlanetCanvasPosition = {
  x: number;
  y: number;
};

export type PlanetPopFeedBubble = {
  id: string;
  message: string;
  delayMs: number;
  brandImage: string;
};

export type PlanetPopFeedItemData = {
  id: string;
  theme: PopFeedTheme;
  image: string;
  appearanceDelayMs: number;
  position: PlanetCanvasPosition;
  rotation: number;
  bubbles: PlanetPopFeedBubble[];
};

export type PlanetPopFeedThemeConfig = {
  icon: string;
  surface: string;
  border: string;
  shadow: string;
};

export type PlanetPopFeedBrandMessage = string | readonly string[];

export type PlanetPopFeedBrandCopy = {
  report: PlanetPopFeedBrandMessage;
  reportLinked?: PlanetPopFeedBrandMessage;
  suggestion: PlanetPopFeedBrandMessage;
  coupDeCoeur: PlanetPopFeedBrandMessage;
};

export type PlanetPopFeedBrandConfig = {
  id: string;
  label: string;
  image: string;
  copy: PlanetPopFeedBrandCopy;
};
