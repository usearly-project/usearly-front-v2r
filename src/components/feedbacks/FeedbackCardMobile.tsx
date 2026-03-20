import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import InteractiveFeedbackCard from "../InteractiveFeedbackCard/InteractiveFeedbackCard";
import "./FeedbackCardMobile.scss";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const FeedbackCardMobile: React.FC<Props> = ({ item, isOpen }) => {
  return (
    <div className="feedback-card-mobile-root">
      <InteractiveFeedbackCard
        item={item}
        isOpen={isOpen}
        //onToggle={onToggle}
        addClassName="feedback-card-mobile-shell"
      />
    </div>
  );
};

export default FeedbackCardMobile;
