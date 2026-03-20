import { useRef, type CSSProperties } from "react";
import MouseTrail from "@src/pages/newHome/components/heroSection/MouseTrail";
import usePlanetScene from "@src/pages/aboutClassic/hooks/usePlanetScene";
import PlanetCanvasFeedItem from "./planetCanvas/PlanetCanvasFeedItem";
import { PLANET_CANVAS_TRAIL_IMAGES } from "./planetCanvas/planetCanvasConfig";
import { toCssSize } from "./planetCanvas/planetCanvasUtils";
import usePlanetPopFeed from "./planetCanvas/usePlanetPopFeed";
import type { PopFeedVariant } from "./planetCanvas/types";
import "./PlanetCanvas.scss";

type PlanetCanvasProps = {
  size?: number | string;
  width?: number | string;
  height?: number | string;
  className?: string;
  popFeed?: boolean;
  popFeedVariant?: PopFeedVariant;
};

const CANVAS_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
};

const PlanetCanvas = ({
  size,
  width,
  height,
  className,
  popFeed = false,
  popFeedVariant = "default",
}: PlanetCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const feedItems = usePlanetPopFeed(popFeed);
  const wrapperStyle = {
    width: toCssSize(width ?? size) ?? "600px",
    height: toCssSize(height ?? size) ?? "600px",
  } as CSSProperties;

  usePlanetScene(canvasRef);

  return (
    <div
      className={`about-classic__canvas-wrap${className ? ` ${className}` : ""}`}
      style={wrapperStyle}
    >
      <canvas
        id="c"
        ref={canvasRef}
        aria-label="Planète 3D"
        style={CANVAS_STYLE}
      ></canvas>
      <MouseTrail images={PLANET_CANVAS_TRAIL_IMAGES} mode="random" />
      {popFeed && (
        <div className="planet-pop-feed" aria-hidden="true">
          {feedItems.map((item) => (
            <PlanetCanvasFeedItem
              key={item.id}
              item={item}
              variant={popFeedVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanetCanvas;
