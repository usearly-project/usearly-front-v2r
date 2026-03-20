export type PublicationCardData = {
  id: string;
  src: string;
  alt: string;
  label: string;
  slideIndex: number;
};

export type PublicationSlideData = {
  id: string;
  realIndex: number;
  cards: PublicationCardData[];
};

type RawPublicationCard = Omit<PublicationCardData, "id" | "slideIndex">;

const rawPublicationCards: RawPublicationCard[] = [
  {
    src: "/assets/slides/cardSignal1.svg",
    alt: "Premiere carte signalement",
    label: "Carte signalement 1",
  },
  {
    src: "/assets/slides/cardSignal2.svg",
    alt: "Seconde carte signalement",
    label: "Carte signalement 2",
  },
  {
    src: "/assets/slides/cardCDC1.svg",
    alt: "Premiere carte coup de coeur",
    label: "Carte coup de coeur 1",
  },
  {
    src: "/assets/slides/cardCDC2.svg",
    alt: "Seconde carte coup de coeur",
    label: "Carte coup de coeur 2",
  },
  {
    src: "/assets/slides/cardSuggestion1.svg",
    alt: "Premiere carte suggestion",
    label: "Carte suggestion 1",
  },
  {
    src: "/assets/slides/cardSuggestion2.svg",
    alt: "Seconde carte suggestion",
    label: "Carte suggestion 2",
  },
];

export const publicationSlides = rawPublicationCards.reduce<
  PublicationSlideData[]
>((groupedSlides, card, cardPosition) => {
  const slideIndex = Math.floor(cardPosition / 2);
  const slideCard = {
    ...card,
    id: `slide-${slideIndex}-card-${cardPosition % 2}`,
    slideIndex,
  };
  const existingSlide = groupedSlides[slideIndex];

  if (existingSlide) {
    existingSlide.cards.push(slideCard);
    return groupedSlides;
  }

  groupedSlides[slideIndex] = {
    id: `slide-${slideIndex}`,
    realIndex: slideIndex,
    cards: [slideCard],
  };

  return groupedSlides;
}, []);

export const publicationCards = publicationSlides.flatMap(
  (slide) => slide.cards,
);
