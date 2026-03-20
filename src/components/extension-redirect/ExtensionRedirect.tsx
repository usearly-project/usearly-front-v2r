import chevronRight from "/assets/icons/chevronRight.svg";
import chevronLeft from "/assets/icons/chevronLeft.svg";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";
import "./ExtensionRedirect.scss";
import googleBadge from "/assets/badge-google.png";
import AnimatedExtensionLandingSlide from "./AnimatedExtensionLandingSlide";

const extensionSlides = [
  {
    src: "/assets/images/chromeExtensionImg.svg",
    alt: "Aperçu de l'extension Usearly, slide 1",
  },
  {
    src: "/assets/images/Landing/ExtensionLandingSlide1.svg",
    alt: "Aperçu de l'extension Usearly, slide 2",
  },
  {
    src: "/assets/images/Landing/ExtensionLandingSlide2.svg",
    alt: "Aperçu de l'extension Usearly, slide 3",
  },
  {
    src: "/assets/images/Landing/ExtensionLandingSlide3.svg",
    alt: "Aperçu de l'extension Usearly, slide 4",
  },
  {
    src: "/assets/images/Landing/ExtensionLandingSlide4.svg",
    alt: "Aperçu de l'extension Usearly, slide 5",
  },
];

const SWIPE_THRESHOLD = 48;

type ExtensionRedirectProps = {
  isModal?: boolean;
  onClose?: () => void;
};

const ExtensionRedirect = ({
  isModal = false,
  onClose,
}: ExtensionRedirectProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselVisible, setIsCarouselVisible] = useState(false);
  const [activeSlideAnimationToken, setActiveSlideAnimationToken] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const touchDeltaY = useRef(0);
  const shouldIgnoreNextClick = useRef(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const hasTriggeredInitialAnimation = useRef(false);
  const shouldSkipNextSlideReplay = useRef(false);

  useEffect(() => {
    if (isModal) {
      setIsCarouselVisible(true);
      hasTriggeredInitialAnimation.current = true;
      shouldSkipNextSlideReplay.current = true;
      setActiveSlideAnimationToken(1);
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport || typeof IntersectionObserver === "undefined") {
      setIsCarouselVisible(true);
      hasTriggeredInitialAnimation.current = true;
      shouldSkipNextSlideReplay.current = true;
      setActiveSlideAnimationToken(1);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setIsCarouselVisible(true);

        if (!hasTriggeredInitialAnimation.current) {
          hasTriggeredInitialAnimation.current = true;
          shouldSkipNextSlideReplay.current = true;
          setActiveSlideAnimationToken(1);
        }

        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, [isModal]);

  useEffect(() => {
    if (!isCarouselVisible || !hasTriggeredInitialAnimation.current) return;
    if (shouldSkipNextSlideReplay.current) {
      shouldSkipNextSlideReplay.current = false;
      return;
    }
    setActiveSlideAnimationToken((currentToken) => currentToken + 1);
  }, [activeSlide, isCarouselVisible]);

  const goToSlide = (slideIndex: number) => {
    setActiveSlide(slideIndex);
  };

  const showPreviousSlide = () => {
    setActiveSlide((currentSlide) => {
      return (
        (currentSlide - 1 + extensionSlides.length) % extensionSlides.length
      );
    });
  };

  const showNextSlide = () => {
    setActiveSlide((currentSlide) => {
      return (currentSlide + 1) % extensionSlides.length;
    });
  };

  const resetTouchState = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];

    shouldIgnoreNextClick.current = false;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchDeltaX.current = 0;
    touchDeltaY.current = 0;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const touch = event.touches[0];

    touchDeltaX.current = touch.clientX - touchStartX.current;
    touchDeltaY.current = touch.clientY - touchStartY.current;
  };

  const handleTouchEnd = () => {
    const isHorizontalSwipe =
      Math.abs(touchDeltaX.current) > Math.abs(touchDeltaY.current);

    if (isHorizontalSwipe && Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      shouldIgnoreNextClick.current = true;

      if (touchDeltaX.current < 0) {
        showNextSlide();
      } else {
        showPreviousSlide();
      }
    }

    resetTouchState();
  };

  const handleViewportClick = (event: MouseEvent<HTMLDivElement>) => {
    if (shouldIgnoreNextClick.current) {
      shouldIgnoreNextClick.current = false;
      return;
    }

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;

    if (clickX < width / 2) {
      showPreviousSlide();
    } else {
      showNextSlide();
    }
  };

  const isLastSlide = activeSlide === extensionSlides.length - 1;

  return (
    <div
      className={`extension-redirect-container ${
        isModal ? "extension-redirect-container--modal" : ""
      }`}
    >
      {isModal && onClose ? (
        <button
          type="button"
          className="extension-redirect-modal-close"
          onClick={onClose}
          aria-label="Fermer la fenêtre d'installation de l'extension"
        >
          <span
            className="extension-redirect-modal-close-text"
            aria-hidden="true"
          >
            ×
          </span>
        </button>
      ) : null}
      <div className="extension-redirect-text-container">
        <div className="extension-redirect-text-title">
          <h2>Installer l'extension Usearly</h2>
        </div>
        <div className="extension-redirect-text-description">
          <p>
            Contribuez à améliorer vos sites et applications préférés à partir
            de votre navigateur Web <br />
            <span className="extension-available">
              Disponible sur le Chrome Web Store
            </span>
          </p>
        </div>
        <div className="extension-redirect-text-button">
          <a
            href="https://chromewebstore.google.com/detail/geclfkocbehpdojggpaeeofgdiiajcii"
            target="_blank"
            rel="noopener noreferrer"
            className="chrome-store-link"
          >
            <img
              src={googleBadge}
              alt="Disponible sur le Chrome Web Store"
              className="chrome-store-badge"
            />
          </a>
        </div>
      </div>
      <div
        className={`extension-redirect-image-container ${
          isLastSlide ? "is-last-slide" : ""
        }`}
      >
        <div
          className="extension-redirect-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Aperçus de l'extension Usearly"
        >
          <div className="extension-redirect-carousel-stage">
            <div
              className="extension-redirect-carousel-viewport"
              ref={viewportRef}
              onClick={handleViewportClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={resetTouchState}
            >
              <div
                className="extension-redirect-carousel-track"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {extensionSlides.map((slide, index) => (
                  <div
                    key={slide.src}
                    className="extension-redirect-carousel-slide"
                    aria-hidden={activeSlide !== index}
                  >
                    {activeSlide === index && isCarouselVisible ? (
                      <AnimatedExtensionLandingSlide
                        key={`${slide.src}-${activeSlideAnimationToken}`}
                        src={slide.src}
                        alt={slide.alt}
                        className="extension-redirect-slide-visual is-active"
                      />
                    ) : (
                      <img src={slide.src} alt={slide.alt} draggable={false} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="extension-redirect-carousel-controls">
        <button
          type="button"
          className="extension-redirect-carousel-arrow"
          onClick={showPreviousSlide}
          aria-label="Voir le slide précédent"
        >
          <span aria-hidden="true">
            <img
              src={chevronLeft}
              style={{ width: "13px", height: "13px" }}
              alt="Carousel tuto installation extension chrome suivant"
            />
          </span>
        </button>

        <div
          className="extension-redirect-carousel-dots"
          role="tablist"
          aria-label="Pagination du carousel"
        >
          {extensionSlides.map((slide, index) => (
            <button
              key={`${slide.src}-dot`}
              type="button"
              role="tab"
              tabIndex={activeSlide === index ? 0 : -1}
              className={`extension-redirect-carousel-dot ${
                activeSlide === index ? "is-active" : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller au slide ${index + 1}`}
              aria-selected={activeSlide === index}
            />
          ))}
        </div>

        <button
          type="button"
          className="extension-redirect-carousel-arrow"
          onClick={showNextSlide}
          aria-label="Voir le slide suivant"
        >
          <span aria-hidden="true">
            <img
              src={chevronRight}
              style={{ width: "13px", height: "13px" }}
              alt="Carousel tuto installation extension chrome Retour"
            />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ExtensionRedirect;
