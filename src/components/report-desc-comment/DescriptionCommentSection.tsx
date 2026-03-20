import React, { useEffect, useState } from "react";
import "./DescriptionCommentSection.scss";
import { MessageCircleMore, Share2 } from "lucide-react";
import CommentSection from "@src/components/comments/CommentSection";
import DescriptionReactionSelector from "@src/utils/DescriptionReactionSelector";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import type { HasBrandResponse } from "@src/types/brandResponse";

interface Props {
  descriptionId: string;
  userId: string;
  type: "report" | "suggestion" | "coupdecoeur";
  modeCompact?: boolean;
  triggerType?: "default" | "text";
  onOpenSimilarReports?: () => void;
  forceClose?: boolean;
  onOpen?: () => void;
  reportIds?: string[];
  autoOpenIfComments?: boolean;
  hideFooter?: boolean;
  brand?: string;
  brandSiteUrl?: string;
  brandResponse?: HasBrandResponse;
  refreshKey?: number;
  forceOpen?: boolean;
  onCommentCountChange?: (count: number) => void;
  onCommentAddedOrDeleted?: () => void;
  onCommentsUpdate?: (newCount: number) => void;
  isPublic?: boolean;
}

const DescriptionCommentSection: React.FC<Props> = ({
  descriptionId,
  userId,
  type,
  modeCompact = false,
  brand,
  triggerType = "default",
  onOpenSimilarReports,
  forceClose = false,
  onOpen,
  reportIds,
  /* autoOpenIfComments = false, */
  hideFooter = false,
  refreshKey,
  forceOpen = false,
  brandSiteUrl,
  brandResponse,
  onCommentCountChange,
  /* onCommentAddedOrDeleted, */
  onCommentsUpdate,
  isPublic = false,
}) => {
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  // Choix entre prop et état local
  const effectiveRefreshKey = refreshKey ?? localRefreshKey;

  const { comments } = useCommentsForDescription(
    descriptionId,
    type,
    effectiveRefreshKey,
  );
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    onCommentCountChange?.(comments.length);
  }, [comments.length]);

  useEffect(() => {
    onCommentsUpdate?.(comments.length);
  }, [comments.length]);

  const toggleComments = () => {
    if (isPublic) {
      window.dispatchEvent(new Event("USEARLY_OPEN_LOGIN"));
      return;
    }

    const newState = !showComments;
    setShowComments(newState);

    if (newState) {
      onOpen?.();
      onOpenSimilarReports?.();
    }
  };

  useEffect(() => {
    setShowComments(forceOpen);
    if (forceOpen) {
      onOpen?.();
      onOpenSimilarReports?.();
    }
  }, [forceOpen]);

  useEffect(() => {
    const handleExternalToggle = () => {
      setShowComments(true);
      onOpen?.();
      onOpenSimilarReports?.();
    };

    window.addEventListener("usearly-toggle-comments", handleExternalToggle);

    return () => {
      window.removeEventListener(
        "usearly-toggle-comments",
        handleExternalToggle,
      );
    };
  }, []);

  useEffect(() => {
    if (forceClose && showComments) {
      setShowComments(false);
    }
  }, [forceClose]);

  return (
    <div
      className={`description-comment-section ${modeCompact ? "compact" : ""}`}
    >
      {!hideFooter && (
        <div className="feedback-footer">
          {triggerType === "text" ? (
            <div className="reaction-comment-row">
              <DescriptionReactionSelector
                userId={isPublic ? "" : userId}
                descriptionId={descriptionId}
                type={type}
                displayAsTextLike
              />
              <span className="divider">|</span>
              <button className="reply-button" onClick={toggleComments}>
                Répondre
                {comments.length > 0 && (
                  <span className="comment-count">
                    {comments.length}{" "}
                    {comments.length === 1 ? "réponse" : "réponses"}
                  </span>
                )}
              </button>
            </div>
          ) : (
            !modeCompact && (
              <>
                <DescriptionReactionSelector
                  userId={userId}
                  descriptionId={descriptionId}
                  type={type}
                />
                <button className="comment-toggle-btn" onClick={toggleComments}>
                  <MessageCircleMore size={16} />
                  {comments.length > 0 && (
                    <span className="comment-inline-count">
                      {comments.length}
                    </span>
                  )}
                  {type === "suggestion" && (
                    <span className="icon-tooltip">Commentaires</span>
                  )}
                </button>
                <button className="comment-toggle-btn">
                  <Share2 size={16} />
                  {type === "suggestion" && (
                    <span className="icon-tooltip">Partager</span>
                  )}
                </button>
              </>
            )
          )}
        </div>
      )}

      {showComments && (
        <CommentSection
          descriptionId={descriptionId}
          type={type}
          brand={brand}
          brandSiteUrl={brandSiteUrl}
          brandResponse={brandResponse}
          reportIds={reportIds}
          readOnly={isPublic}
          onCommentAdded={() => setLocalRefreshKey((k) => k + 1)}
          onCommentDeleted={() => setLocalRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default DescriptionCommentSection;
