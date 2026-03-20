import type { PlanetCanvasPosition, PopFeedTheme } from "./types";

const MOBILE_BREAKPOINT = 900;

export const toCssSize = (value?: number | string) => {
  if (typeof value === "number") {
    return `${value}px`;
  }

  return value;
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const getDistance = (
  first: PlanetCanvasPosition,
  second: PlanetCanvasPosition,
) => Math.hypot(first.x - second.x, first.y - second.y);

export const getRandomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const pickRandomValue = <T>(values: readonly T[]) =>
  values[Math.floor(Math.random() * values.length)]!;

export const shuffleValues = <T>(values: readonly T[]) => {
  const nextValues = [...values];

  for (let index = nextValues.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextValues[index], nextValues[swapIndex]] = [
      nextValues[swapIndex],
      nextValues[index],
    ];
  }

  return nextValues;
};

export const refillImagePool = (length: number, lastImageIndex: number) => {
  const nextPool = shuffleValues(Array.from({ length }, (_, index) => index));

  if (length > 1 && nextPool[0] === lastImageIndex) {
    const replacementIndex = nextPool.findIndex(
      (value) => value !== lastImageIndex,
    );

    if (replacementIndex > 0) {
      [nextPool[0], nextPool[replacementIndex]] = [
        nextPool[replacementIndex],
        nextPool[0],
      ];
    }
  }

  return nextPool;
};

export const pickPopFeedTheme = (): PopFeedTheme => {
  const roll = Math.random();

  if (roll < 0.34) return "report";
  if (roll < 0.68) return "suggestion";
  return "coupDeCoeur";
};

export const getPlanetPopFeedViewportSettings = (viewportWidth: number) => ({
  maxVisibleItems: viewportWidth < MOBILE_BREAKPOINT ? 1 : 3,
  allowReportPairs: viewportWidth >= MOBILE_BREAKPOINT,
  minDistance: viewportWidth < MOBILE_BREAKPOINT ? 28 : 18,
  reportPairMinOffset: viewportWidth < MOBILE_BREAKPOINT ? 28 : 22,
  reportVerticalRange: viewportWidth < MOBILE_BREAKPOINT ? 7 : 5,
  firstSpawnDelayMin: viewportWidth < MOBILE_BREAKPOINT ? 900 : 550,
  firstSpawnDelayMax: viewportWidth < MOBILE_BREAKPOINT ? 1500 : 1100,
  nextSpawnDelayMin: viewportWidth < MOBILE_BREAKPOINT ? 2000 : 1400,
  nextSpawnDelayMax: viewportWidth < MOBILE_BREAKPOINT ? 2800 : 2600,
});
