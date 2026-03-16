import "./DesktopCarousel.scss";
import {
  useState,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import { publicationSlides } from "./publicationCarouselData";

const realSlides = publicationSlides;

const realSlidesCount = realSlides.length;
const loopCopies = 3;
const centerCopyIndex = Math.floor(loopCopies / 2);
const centerStartIndex = realSlidesCount * centerCopyIndex;
const slides = Array.from({ length: loopCopies }, () => realSlides).flat();

const getRealIndex = (virtualIndex: number) =>
  ((virtualIndex % realSlidesCount) + realSlidesCount) % realSlidesCount;

const getCenteredIndex = (virtualIndex: number) =>
  centerStartIndex + getRealIndex(virtualIndex);

const swipeIntentThreshold = 14;
const swipeThreshold = 48;

type Props = {
  onSlideChange?: (index: number) => void;
};

export default function DesktopCarousel({ onSlideChange }: Props) {
  const [index, setIndex] = useState(centerStartIndex);
  const [transition, setTransition] = useState(true);
  const [visibleSlideIndex, setVisibleSlideIndex] = useState<number | null>(
    null,
  );
  const swipeStateRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    hasSwipeIntent: false,
  });
  const suppressCardClickRef = useRef(false);
  const [activeCardBySlide, setActiveCardBySlide] = useState<
    Record<number, number>
  >(() =>
    realSlides.reduce<Record<number, number>>((activeState, slide) => {
      activeState[slide.realIndex] = 0;
      return activeState;
    }, {}),
  );

  const currentRealIndex = getRealIndex(index);

  const moveToSlide = (getNextIndex: (currentIndex: number) => number) => {
    setIndex((currentIndex) => {
      const nextIndex = getNextIndex(currentIndex);

      if (nextIndex !== currentIndex) {
        setVisibleSlideIndex(nextIndex);
      }

      return nextIndex;
    });
  };

  const next = () => moveToSlide((currentIndex) => currentIndex + 1);
  const prev = () => moveToSlide((currentIndex) => currentIndex - 1);

  const handleCardFocus = (slideIndex: number, cardIndex: number) => {
    setActiveCardBySlide((prev) => {
      if (prev[slideIndex] === cardIndex) {
        return prev;
      }

      return {
        ...prev,
        [slideIndex]: cardIndex,
      };
    });
  };

  const resetSwipeState = () => {
    swipeStateRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      hasSwipeIntent: false,
    };
  };

  const releaseSuppressedCardClick = () => {
    requestAnimationFrame(() => {
      suppressCardClickRef.current = false;
    });
  };

  const handleCardClick = (
    event: ReactMouseEvent<HTMLButtonElement>,
    slideIndex: number,
    cardIndex: number,
  ) => {
    if (suppressCardClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    handleCardFocus(slideIndex, cardIndex);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) {
      return;
    }

    if (event.pointerType === "mouse") {
      return;
    }

    swipeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      hasSwipeIntent: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipeState = swipeStateRef.current;

    if (swipeState.pointerId !== event.pointerId) {
      return;
    }

    swipeState.deltaX = event.clientX - swipeState.startX;
    swipeState.deltaY = event.clientY - swipeState.startY;

    if (
      !swipeState.hasSwipeIntent &&
      Math.abs(swipeState.deltaX) > swipeIntentThreshold &&
      Math.abs(swipeState.deltaX) > Math.abs(swipeState.deltaY)
    ) {
      swipeState.hasSwipeIntent = true;
      suppressCardClickRef.current = true;
    }
  };

  const finishPointerGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipeState = swipeStateRef.current;

    if (swipeState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const hasHorizontalSwipe =
      Math.abs(swipeState.deltaX) >= swipeThreshold &&
      Math.abs(swipeState.deltaX) > Math.abs(swipeState.deltaY);

    if (hasHorizontalSwipe) {
      if (swipeState.deltaX < 0) {
        next();
      } else {
        prev();
      }
    }

    if (swipeState.hasSwipeIntent) {
      releaseSuppressedCardClick();
    }

    resetSwipeState();
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipeState = swipeStateRef.current;

    if (swipeState.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (swipeState.hasSwipeIntent) {
      releaseSuppressedCardClick();
    }

    resetSwipeState();
  };

  /* autoplay */

  useEffect(() => {
    const interval = setInterval(() => {
      moveToSlide((currentIndex) => currentIndex + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* envoyer le bon index au parent */

  useEffect(() => {
    onSlideChange?.(currentRealIndex);
  }, [currentRealIndex, onSlideChange]);

  /* reset invisible quand on atteint un clone */

  const handleTransitionEnd = (event: ReactTransitionEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    const centeredIndex = getCenteredIndex(index);

    if (centeredIndex !== index) {
      setVisibleSlideIndex(null);
      setTransition(false);
      setIndex(centeredIndex);
      return;
    }

    setVisibleSlideIndex(null);
  };

  /* réactiver transition */

  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransition(true));
      });
    }
  }, [transition]);

  return (
    <div className="desktop-carousel">
      {/* <button
        type="button"
        className="carousel-arrow left"
        onClick={prev}
        aria-label="Slide precedent"
      >
        ‹
      </button> */}

      <div
        className="carousel-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerGesture}
        onPointerCancel={handlePointerCancel}
      >
        <div className="carousel-viewport-mask">
          <div
            className="carousel-track"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: transition
                ? "transform .6s cubic-bezier(.22,.61,.36,1)"
                : "none",
            }}
          >
            {slides.map((slide, i) => {
              const activeCardIndex = activeCardBySlide[slide.realIndex] ?? 0;
              const shouldHideSlideContent =
                visibleSlideIndex !== null && i !== visibleSlideIndex;

              return (
                <div
                  className={`carousel-slide ${slide.realIndex === 0 ? "carousel-slide--reports" : ""}`}
                  key={`${slide.id}-${i}`}
                >
                  <div
                    className={`stacked-slide ${shouldHideSlideContent ? "is-hidden-during-transition" : ""}`}
                  >
                    {slide.cards.map((card, cardIndex) => {
                      const isFront = activeCardIndex === cardIndex;

                      return (
                        <button
                          type="button"
                          key={card.src}
                          className={`stacked-card card-slot-${cardIndex === 0 ? "a" : "b"} ${isFront ? "is-front" : "is-back"}`}
                          onClick={(event) =>
                            handleCardClick(event, slide.realIndex, cardIndex)
                          }
                          aria-pressed={isFront}
                          aria-label={`${card.label}${isFront ? ", au premier plan" : ", afficher au premier plan"}`}
                        >
                          <img
                            src={card.src}
                            alt={card.alt}
                            loading="lazy"
                            draggable={false}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <button
        type="button"
        className="carousel-arrow right"
        onClick={next}
        aria-label="Slide suivant"
      >
        ›
      </button> */}

      <div className="carousel-dots">
        <span className="carousel-dots-chevron" onClick={prev}>
          ‹
        </span>
        {realSlides.map((_, i) => (
          <button
            type="button"
            key={i}
            className={`carousel-dot ${currentRealIndex === i ? "active" : ""}`}
            onClick={() => moveToSlide(() => centerStartIndex + i)}
          />
        ))}
        <span className="carousel-dots-chevron" onClick={next}>
          ›
        </span>
      </div>
    </div>
  );
}
