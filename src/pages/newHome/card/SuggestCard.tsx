import React, { useState } from "react";
import "./SuggestCard.scss";
import suggestHead from "/assets/icons/suggest-head.svg";
import InteractiveFeedbackCard from "@src/components/InteractiveFeedbackCard/InteractiveFeedbackCard";
import { useNavigate } from "react-router-dom";
import type { Suggestion } from "@src/types/Reports";
import Buttons from "@src/components/buttons/Buttons";
import { useAuth } from "@src/services/AuthContext";
import SliderDots from "@src/components/shared/sliderDots/sliderDots";
import fakeSuggestionsData from "@src/data/suggestions/suggestionFakeData.json";

const SuggestCard: React.FC = () => {
  const fakeSuggestions = fakeSuggestionsData.map((suggestion) => ({
    ...suggestion,
    type: "suggestion",
  })) as unknown as (Suggestion & { type: "suggestion" })[];

  const { isAuthenticated } = useAuth();
  const suggestions = fakeSuggestions;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openCardId, ,] = useState<string | null>(null);

  const slideCount = suggestions.length;
  const slideWidth = slideCount > 0 ? 100 / slideCount : 100;
  const navigate = useNavigate();

  const handleButtonClick = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      (e.nativeEvent as any).stopImmediatePropagation?.();
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/");
  };

  /*  const handleToggleCard = (id: string) => {
    setOpenCardId((prev) => (prev === id ? null : id));
  }; */
  return (
    <div className="suggest-card">
      <div className="suggest-title">
        Les suggestions qui font rêver !
        <img src={suggestHead} alt="suggestHead" />
      </div>

      <div className="suggest-main" onClickCapture={() => handleButtonClick()}>
        <div
          className="suggest-slider"
          style={{
            width: `${slideCount * 100}%`,
            transform: `translateX(-${currentSlide * slideWidth}%)`,
          }}
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggest-slide"
              style={{ width: `${slideWidth}%` }} // 33.333 %
            >
              <InteractiveFeedbackCard
                item={suggestion}
                isOpen={openCardId === suggestion.id}
                //onToggle={handleToggleCard}
                addClassName="guest-mode"
              />
              <InteractiveFeedbackCard
                item={suggestion}
                isOpen={openCardId === suggestion.id}
                //onToggle={handleToggleCard}
                addClassName="guest-mode"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="suggest-footer">
        <Buttons
          addClassName="suggest-btn"
          title="En voir plus"
          onClick={handleButtonClick}
        />
        <SliderDots
          count={suggestions.length}
          current={currentSlide}
          onChange={setCurrentSlide}
        />
      </div>
    </div>
  );
};

export default SuggestCard;
