import { type CSSProperties } from "react";
import { POP_FEED_THEME_CONFIG } from "./planetCanvasConfig";
import type {
  PlanetPopFeedBubble,
  PlanetPopFeedItemData,
  PopFeedTheme,
  PopFeedVariant,
} from "./types";

const PASTEL_THEME_STYLE_BY_THEME: Record<
  PopFeedTheme,
  {
    surface: string;
    border: string;
    shadow: string;
    text: string;
  }
> = {
  report: {
    surface: "#C7E5FF",
    border: "rgba(255, 255, 255, 0.92)",
    shadow: "rgba(126, 153, 220, 0.26)",
    text: "#000000",
  },
  suggestion: {
    surface: "#B6FFC6",
    border: "rgba(255, 255, 255, 0.92)",
    shadow: "rgba(105, 185, 143, 0.24)",
    text: "#000000",
  },
  coupDeCoeur: {
    surface: "#FFD2DA",
    border: "rgba(255, 255, 255, 0.92)",
    shadow: "rgba(158, 134, 219, 0.24)",
    text: "#000000",
  },
};

type PlanetCanvasBubbleProps = {
  bubble: PlanetPopFeedBubble;
  icon: string;
};

const PlanetCanvasBubble = ({ bubble, icon }: PlanetCanvasBubbleProps) => (
  <div
    className="planet-pop-feed__bubble"
    style={
      {
        "--planet-pop-feed-delay": `${bubble.delayMs}ms`,
      } as CSSProperties
    }
  >
    <span className="planet-pop-feed__bubble-icon">
      <img src={icon} alt="" aria-hidden="true" />
    </span>
    <span className="planet-pop-feed__bubble-text">{bubble.message}</span>
    <span className="planet-pop-feed__bubble-brand">
      <img src={bubble.brandImage} alt="" aria-hidden="true" />
    </span>
  </div>
);

type PlanetCanvasFeedItemProps = {
  item: PlanetPopFeedItemData;
  variant?: PopFeedVariant;
};

const PlanetCanvasFeedItem = ({
  item,
  variant = "default",
}: PlanetCanvasFeedItemProps) => {
  const themeConfig = POP_FEED_THEME_CONFIG[item.theme];
  const variantThemeConfig =
    variant === "pastel" ? PASTEL_THEME_STYLE_BY_THEME[item.theme] : null;
  const bubbleAlignmentClass =
    item.position.x <= 28
      ? "planet-pop-feed__item--align-start"
      : item.position.x >= 72
        ? "planet-pop-feed__item--align-end"
        : "planet-pop-feed__item--align-center";
  const itemStyle = {
    left: `${item.position.x}%`,
    top: `${item.position.y}%`,
    "--planet-pop-feed-item-delay": `${item.appearanceDelayMs}ms`,
    "--planet-pop-feed-surface":
      variantThemeConfig?.surface ?? themeConfig.surface,
    "--planet-pop-feed-border":
      variantThemeConfig?.border ?? themeConfig.border,
    "--planet-pop-feed-shadow":
      variantThemeConfig?.shadow ?? themeConfig.shadow,
    "--planet-pop-feed-text": variantThemeConfig?.text ?? "#ffffff",
    "--planet-pop-feed-rotation": `${item.rotation}deg`,
  } as CSSProperties;
  const variantClass =
    variant === "pastel" ? "planet-pop-feed__item--pastel" : "";

  return (
    <div
      className={`planet-pop-feed__item planet-pop-feed__item--${item.theme} ${bubbleAlignmentClass} ${variantClass}`}
      style={itemStyle}
    >
      <div className="planet-pop-feed__bubbles">
        {item.bubbles.map((bubble) => (
          <PlanetCanvasBubble
            key={bubble.id}
            bubble={bubble}
            icon={themeConfig.icon}
          />
        ))}
      </div>
      <div className="planet-pop-feed__photo-shell">
        <img
          className="planet-pop-feed__photo"
          src={item.image}
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default PlanetCanvasFeedItem;
