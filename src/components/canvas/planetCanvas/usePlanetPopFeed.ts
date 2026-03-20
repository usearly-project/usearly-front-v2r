import { useEffect, useRef, useState } from "react";
import {
  PLANET_CANVAS_TRAIL_IMAGES,
  POP_FEED_BRANDS,
  POP_FEED_LIFETIME_MS,
  POP_FEED_MAX_ATTEMPTS,
  buildPopFeedBrandMessage,
} from "./planetCanvasConfig";
import {
  clamp,
  getDistance,
  getPlanetPopFeedViewportSettings,
  getRandomBetween,
  pickPopFeedTheme,
  pickRandomValue,
  refillImagePool,
} from "./planetCanvasUtils";
import type {
  PlanetCanvasPosition,
  PlanetPopFeedBrandConfig,
  PlanetPopFeedBubble,
  PlanetPopFeedItemData,
  PopFeedTheme,
} from "./types";

type FeedItemsUpdater = (
  currentItems: PlanetPopFeedItemData[],
) => PlanetPopFeedItemData[];

type BuildFeedItemArgs = {
  itemId: string;
  bubbleId: string;
  theme: PopFeedTheme;
  brand: PlanetPopFeedBrandConfig;
  image: string;
  appearanceDelayMs: number;
  position: PlanetCanvasPosition;
  message: string;
};

const createFeedItemId = () =>
  `planet-feed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const pickRandomBrand = () => pickRandomValue(POP_FEED_BRANDS);

const buildBubble = (
  id: string,
  brand: PlanetPopFeedBrandConfig,
  message: string,
): PlanetPopFeedBubble => ({
  id,
  message,
  delayMs: 0,
  brandImage: brand.image,
});

const buildFeedItem = ({
  itemId,
  bubbleId,
  theme,
  brand,
  image,
  appearanceDelayMs,
  position,
  message,
}: BuildFeedItemArgs): PlanetPopFeedItemData => ({
  id: itemId,
  theme,
  image,
  appearanceDelayMs,
  position,
  rotation: getRandomBetween(-7, 7),
  bubbles: [buildBubble(bubbleId, brand, message)],
});

const usePlanetPopFeed = (enabled: boolean) => {
  const [feedItems, setFeedItems] = useState<PlanetPopFeedItemData[]>([]);
  const activeItemsRef = useRef<PlanetPopFeedItemData[]>([]);
  const imagePoolRef = useRef<number[]>([]);
  const lastImageIndexRef = useRef(-1);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(() => {
    const clearScheduledTimeouts = () => {
      timeoutIdsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
      timeoutIdsRef.current = [];
    };

    const resetFeedState = () => {
      activeItemsRef.current = [];
      setFeedItems([]);
      imagePoolRef.current = [];
      lastImageIndexRef.current = -1;
      clearScheduledTimeouts();
    };

    const syncFeedItems = (updater: FeedItemsUpdater) => {
      setFeedItems((currentItems) => {
        const nextItems = updater(currentItems);
        activeItemsRef.current = nextItems;
        return nextItems;
      });
    };

    if (!enabled) {
      resetFeedState();
      return;
    }

    let isDisposed = false;

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = window.setTimeout(() => {
        timeoutIdsRef.current = timeoutIdsRef.current.filter(
          (value) => value !== timeoutId,
        );

        if (!isDisposed) {
          callback();
        }
      }, delayMs);

      timeoutIdsRef.current.push(timeoutId);
      return timeoutId;
    };

    const getViewportSettings = () =>
      getPlanetPopFeedViewportSettings(window.innerWidth);

    const pickImage = () => {
      if (!imagePoolRef.current.length) {
        imagePoolRef.current = refillImagePool(
          PLANET_CANVAS_TRAIL_IMAGES.length,
          lastImageIndexRef.current,
        );
      }

      const nextImageIndex = imagePoolRef.current.shift() ?? 0;
      lastImageIndexRef.current = nextImageIndex;
      return PLANET_CANVAS_TRAIL_IMAGES[nextImageIndex];
    };

    const pickDifferentImage = (excludedImage: string) => {
      if (PLANET_CANVAS_TRAIL_IMAGES.length <= 1) {
        return pickImage();
      }

      for (
        let attempt = 0;
        attempt < PLANET_CANVAS_TRAIL_IMAGES.length;
        attempt += 1
      ) {
        const candidateImage = pickImage();

        if (candidateImage !== excludedImage) {
          return candidateImage;
        }
      }

      return pickImage();
    };

    const pickPosition = (
      theme: PopFeedTheme,
      occupiedPositions: PlanetCanvasPosition[] = [],
    ) => {
      const { minDistance } = getViewportSettings();
      const minY = theme === "report" ? 35 : 30;
      const takenPositions = [
        ...activeItemsRef.current.map((existingItem) => existingItem.position),
        ...occupiedPositions,
      ];

      for (let attempt = 0; attempt < POP_FEED_MAX_ATTEMPTS; attempt += 1) {
        const candidate = {
          x: getRandomBetween(15, 82),
          y: getRandomBetween(minY, 79),
        };
        const isFarEnough = takenPositions.every(
          (existingPosition) =>
            getDistance(existingPosition, candidate) >= minDistance,
        );

        if (isFarEnough) {
          return candidate;
        }
      }

      return {
        x: getRandomBetween(18, 78),
        y: getRandomBetween(minY, 78),
      };
    };

    const pickRelatedReportPosition = (
      anchorPosition: PlanetCanvasPosition,
    ) => {
      const { minDistance, reportPairMinOffset, reportVerticalRange } =
        getViewportSettings();
      const preferredDirections = anchorPosition.x > 56 ? [-1, 1] : [1, -1];
      const takenPositions = [
        ...activeItemsRef.current.map((existingItem) => existingItem.position),
        anchorPosition,
      ];

      for (const direction of preferredDirections) {
        for (let attempt = 0; attempt < POP_FEED_MAX_ATTEMPTS; attempt += 1) {
          const candidate = {
            x: clamp(
              anchorPosition.x +
                direction *
                  getRandomBetween(
                    reportPairMinOffset,
                    reportPairMinOffset + 8,
                  ),
              16,
              84,
            ),
            y: clamp(
              anchorPosition.y +
                getRandomBetween(-reportVerticalRange, reportVerticalRange),
              34,
              78,
            ),
          };

          const isValidCandidate = takenPositions.every(
            (existingPosition) =>
              getDistance(existingPosition, candidate) >= minDistance,
          );

          if (isValidCandidate) {
            return candidate;
          }
        }
      }

      const fallbackDirection = anchorPosition.x > 56 ? -1 : 1;
      return {
        x: clamp(
          anchorPosition.x + fallbackDirection * (reportPairMinOffset + 6),
          16,
          84,
        ),
        y: clamp(
          anchorPosition.y +
            getRandomBetween(-reportVerticalRange, reportVerticalRange),
          34,
          78,
        ),
      };
    };

    const removeFeedItem = (itemId: string) => {
      syncFeedItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );
    };

    const spawnFeedItem = () => {
      const { maxVisibleItems, reportPairMinOffset, allowReportPairs } =
        getViewportSettings();
      const availableSlots = maxVisibleItems - activeItemsRef.current.length;

      if (availableSlots <= 0) {
        return;
      }

      let theme = pickPopFeedTheme();

      if (theme === "report" && allowReportPairs && availableSlots < 2) {
        theme = Math.random() < 0.5 ? "suggestion" : "coupDeCoeur";
      }

      const itemBaseId = createFeedItemId();

      if (theme === "report" && allowReportPairs) {
        const brand = pickRandomBrand();
        const primaryImage = pickImage();
        const secondaryImage = pickDifferentImage(primaryImage);
        const primaryPosition = pickPosition("report");

        let secondaryPosition = pickRelatedReportPosition(primaryPosition);

        if (
          getDistance(primaryPosition, secondaryPosition) < reportPairMinOffset
        ) {
          secondaryPosition = pickPosition("report", [primaryPosition]);
        }

        const pairDelayMs = getRandomBetween(220, 360);
        const message = buildPopFeedBrandMessage(brand, "report");
        const linkedMessage = buildPopFeedBrandMessage(brand, "report", {
          linked: true,
        });

        const nextItems: PlanetPopFeedItemData[] = [
          buildFeedItem({
            itemId: `${itemBaseId}-a`,
            bubbleId: `${itemBaseId}-a-primary`,
            theme: "report",
            brand,
            image: primaryImage,
            appearanceDelayMs: 0,
            position: primaryPosition,
            message,
          }),
          buildFeedItem({
            itemId: `${itemBaseId}-b`,
            bubbleId: `${itemBaseId}-b-primary`,
            theme: "report",
            brand,
            image: secondaryImage,
            appearanceDelayMs: pairDelayMs,
            position: secondaryPosition,
            message: linkedMessage,
          }),
        ];

        syncFeedItems((currentItems) => [...currentItems, ...nextItems]);

        nextItems.forEach((item) => {
          scheduleTimeout(() => removeFeedItem(item.id), POP_FEED_LIFETIME_MS);
        });

        return;
      }

      const brand = pickRandomBrand();
      const nextItem = buildFeedItem({
        itemId: itemBaseId,
        bubbleId: `${itemBaseId}-primary`,
        theme,
        brand,
        image: pickImage(),
        appearanceDelayMs: 0,
        position: pickPosition(theme),
        message: buildPopFeedBrandMessage(brand, theme),
      });

      syncFeedItems((currentItems) => [...currentItems, nextItem]);
      scheduleTimeout(() => removeFeedItem(nextItem.id), POP_FEED_LIFETIME_MS);
    };

    const scheduleNextSpawn = (isFirstSpawn = false) => {
      const {
        firstSpawnDelayMin,
        firstSpawnDelayMax,
        nextSpawnDelayMin,
        nextSpawnDelayMax,
      } = getViewportSettings();
      const delayMs = isFirstSpawn
        ? getRandomBetween(firstSpawnDelayMin, firstSpawnDelayMax)
        : getRandomBetween(nextSpawnDelayMin, nextSpawnDelayMax);

      scheduleTimeout(() => {
        if (
          activeItemsRef.current.length < getViewportSettings().maxVisibleItems
        ) {
          spawnFeedItem();
        }

        scheduleNextSpawn();
      }, delayMs);
    };

    scheduleNextSpawn(true);

    return () => {
      isDisposed = true;
      clearScheduledTimeouts();
    };
  }, [enabled]);

  return feedItems;
};

export default usePlanetPopFeed;
