import "./MobileCarousel.scss";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { publicationSlides } from "./publicationCarouselData";

const swipeIntentThreshold = 12;
const swipeThreshold = 36;

type Props = {
  onSlideChange?: (index: number) => void;
};

export default function MobileCarousel({ onSlideChange }: Props) {
  const slidesCount = publicationSlides.length;
  const [index, setIndex] = useState(0);
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
    publicationSlides.reduce<Record<number, number>>((activeState, slide) => {
      activeState[slide.realIndex] = 0;
      return activeState;
    }, {}),
  );
  const currentSlide = publicationSlides[index] ?? null;

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

  const next = () => {
    setIndex((prev) => (prev + 1) % slidesCount);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

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

    if (event.pointerType === "mouse" && event.button !== 0) {
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

  useEffect(() => {
    if (!currentSlide) {
      return;
    }

    onSlideChange?.(currentSlide.realIndex);
  }, [currentSlide, onSlideChange]);

  if (!currentSlide) {
    return null;
  }

  return (
    <div className="mobile-carousel">
      <div
        className="mobile-carousel__viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerGesture}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className="mobile-carousel__track"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {publicationSlides.map((slide) => {
            const activeCardIndex = activeCardBySlide[slide.realIndex] ?? 0;

            return (
              <div className="mobile-carousel__slide" key={slide.id}>
                <div className="mobile-carousel__stack">
                  {slide.cards.map((card, cardIndex) => {
                    const isFront = activeCardIndex === cardIndex;

                    return (
                      <button
                        type="button"
                        key={card.id}
                        className={`mobile-carousel__card mobile-carousel__card--slot-${cardIndex === 0 ? "a" : "b"} ${isFront ? "is-front" : "is-back"}`}
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

      <div className="mobile-carousel__controls">
        <div className="mobile-carousel__status">
          <div className="mobile-carousel__dots" aria-hidden="true">
            {publicationSlides.map((slide, slideIndex) => (
              <span
                key={slide.id}
                className={`mobile-carousel__dot ${slideIndex === index ? "is-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
