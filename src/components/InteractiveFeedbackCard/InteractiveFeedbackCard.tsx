import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./InteractiveFeedbackCard.scss";
import { useAuth } from "@src/services/AuthContext";
import { apiService } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import starProgressBar from "/assets/icons/icon-progress-bar.svg";
import FeedbackLeft from "./feedback-left/FeedbackLeft";
import FeedbackRight from "./FeedbackRight";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import CloseButton from "@src/components/buttons/CloseButtons";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
  isOpen: boolean;
  //onToggle: (id: string) => void;
  addClassName?: string;
}

const InteractiveFeedbackCard: React.FC<Props> = ({
  item,
  isOpen,
  //onToggle,
  addClassName,
}) => {
  const { userProfile, isLoading } = useAuth();
  const userId = userProfile?.id ?? null;
  const isGuest = !userId;
  const [votes, setVotes] = useState((item as Suggestion).votes || 0);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const max = 300;
  const thumbSize = 24;
  const isExpired = expiresInDays !== null && expiresInDays <= 0;
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);

  // --- progression
  useLayoutEffect(() => {
    const updateThumb = () => {
      if (barRef.current) {
        const barWidth = barRef.current.offsetWidth;
        const raw = (votes / max) * barWidth;
        const safe = Math.max(
          thumbSize / 2,
          Math.min(barWidth - thumbSize / 2, raw),
        );
        setThumbLeft(safe);
      }
    };
    updateThumb();
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [votes]);

  // --- votes
  useEffect(() => {
    if (isGuest || item.type !== "suggestion") return;
    apiService
      .get(`/suggestions/${item.id}/votes`)
      .then((res) => {
        setVotes(res.data.votes);
        setExpiresInDays(res.data.expiresInDays);
      })
      .catch(() => {});
  }, [item.id, item.type, isGuest]);

  // --- lightbox cleanup
  useEffect(() => {
    return () => {
      if (selectedImage) {
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = "auto";
      }
    };
  }, [selectedImage]);

  useEffect(() => {
    if (!isOpen) {
      setShowComments(false);
    }
  }, [isOpen]);

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleVoteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await apiService.post(`/suggestions/${item.id}/vote`);
      setVotes(res.data.votes);
      showToast("✅ Vote enregistré avec succès", "success");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        "❌ Vous avez déjà voté pour cette suggestion";
      showToast(msg, "error");
    }
  };

  // 🧠 Normalise la marque et l’URL pour éviter le fallback .com
  if (isLoading) return null;
  const siteUrl =
    (item as any)?.siteUrl ?? (item as any)?.brandUrl ?? undefined;

  const safeItem = {
    ...item,
    siteUrl,
    marque: item.marque?.trim() ?? "",
  };

  return (
    <div
      className={`feedback-card ${isOpen ? "open" : ""}${addClassName ? ` ${addClassName}` : ""}`}
    >
      <div className="feedback-main">
        {/* === Bloc gauche === */}
        <FeedbackLeft item={item} isExpanded={isFeedbackExpanded} />
        {/* === Bloc droit === */}
        <FeedbackRight
          item={safeItem}
          //onToggle={onToggle}
          userProfile={userProfile}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          isExpired={isExpired}
          votes={votes}
          max={max}
          barRef={barRef}
          thumbLeft={thumbLeft}
          expiresInDays={expiresInDays}
          starProgressBar={starProgressBar}
          onVoteClick={
            item.type !== "suggestion" || isGuest ? undefined : handleVoteClick
          }
          showComments={showComments}
          onToggleComments={toggleComments}
          commentCount={commentCount}
          isGuest={isGuest}
          onExpandedChange={setIsFeedbackExpanded}
        />
      </div>
      {!!userId && (
        <div
          className={`feedback-comments ${showComments ? "open" : "hidden"}`}
        >
          <DescriptionCommentSection
            userId={userId}
            descriptionId={item.id}
            type={item.type}
            hideFooter={true}
            forceOpen={showComments}
            onCommentCountChange={setCommentCount}
          />
        </div>
      )}

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton stateSetter={setSelectedImage} stateValue={null} />
            <img src={selectedImage} alt="Zoom" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveFeedbackCard;
