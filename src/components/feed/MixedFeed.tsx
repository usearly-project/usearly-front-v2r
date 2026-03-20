import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedItemRenderer from "./FeedItemRenderer";
import { usePublicFeed } from "@src/hooks/usePublicFeed";
import "./MixedFeed.scss";
import { useAuth } from "@src/services/AuthContext";

interface Props {
  isPublic?: boolean;
}

const MixedFeed: React.FC<Props> = ({ isPublic = false }) => {
  const { isAuthenticated } = useAuth();
  const { feed, loadMore, loading, hasMore } = usePublicFeed();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);

    setTimeout(() => {
      setShowAuthTooltip(false);
    }, 2000);
  };

  const handleFilter = (type: string) => {
    setIsOpen(false);

    if (type === "trending") return;

    if (!isAuthenticated) {
      if (type === "report") {
        triggerTooltip("Connecte-toi pour voir les signalements");
      } else if (type === "coupdecoeur") {
        triggerTooltip("Connecte-toi pour voir les coups de cœur");
      } else if (type === "suggestion") {
        triggerTooltip("Connecte-toi pour voir les suggestions");
      } else {
        triggerTooltip("Connecte-toi pour continuer");
      }
      return;
    }

    navigate(`/feedback?tab=${type}`);
  };

  return (
    <div className="mixed-feed">
      {/* ✅ FILTER BAR */}
      <div className="feed-header">
        <div className="feed-filter">
          <button onClick={() => setIsOpen(!isOpen)}>L’actu du moment</button>

          {isOpen && (
            <div className="filter-dropdown">
              <div onClick={() => handleFilter("report")}>Les signalements</div>

              <div onClick={() => handleFilter("coupdecoeur")}>
                Les coups de cœur
              </div>

              <div onClick={() => handleFilter("suggestion")}>
                Les suggestions
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FEED */}
      {feed.map((item) => {
        const id =
          item.type === "report"
            ? item.data.reportingId
            : (item.data.id ?? item.data.title);

        return (
          <FeedItemRenderer
            key={`${item.type}-${id}`}
            item={item}
            isOpen={true}
            isPublic={isPublic}
          />
        );
      })}

      {/* LOADING */}
      {loading && <p className="feed-loading">Chargement...</p>}

      {/* LOAD MORE */}
      {!loading && hasMore && (
        <button onClick={loadMore} className="load-more-btn">
          Load more
        </button>
      )}

      {/* END */}
      {!loading && !hasMore && feed.length > 0 && (
        <p className="end-feed">Tu as tout vu 👀</p>
      )}

      {loading && <p>Loading...</p>}
      {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
    </div>
  );
};

export default MixedFeed;
