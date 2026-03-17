import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import Avatar from "@src/components/shared/Avatar";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import CommentSection from "@src/components/comments/CommentSection";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import CloseButton from "@src/components/buttons/CloseButtons";
import type { TicketStatusKey } from "@src/types/ticketStatus";
import type { HasBrandResponse } from "@src/types/brandResponse";
import "./FlatSubcategoryBlockMobile.scss";

interface Props {
  brand: string;
  siteUrl?: string;
  subcategory: string;
  status: TicketStatusKey;
  descriptions: any[];
  hasBrandResponse?: HasBrandResponse;
  initialDescription: any;
  safeAuthor: {
    id: string | null;
    pseudo: string;
    email: string | null;
    avatar: string | null;
  };
  resolvedLogo: string;
  captureUrl: string | null;
  expanded: boolean;
  showComments: boolean;
  showSimilarReports: boolean;
  showFullText: boolean;
  showCapturePreview: boolean;
  visibleDescriptionsCount: number;
  commentsCount: number;
  effectiveReportIds: string[];
  onToggleExpanded: () => void;
  onToggleComments: () => void;
  onToggleSimilarReports: () => void;
  onToggleFullText: () => void;
  onOpenCapture: () => void;
  onCloseCapture: () => void;
  onRefreshComments: () => void;
  onShowMoreSimilar: () => void;
  onShowLessSimilar: () => void;
}

const PREVIEW_LENGTH = 100;

const FlatSubcategoryBlockMobile: React.FC<Props> = ({
  brand,
  siteUrl,
  subcategory,
  status,
  descriptions,
  hasBrandResponse,
  initialDescription,
  safeAuthor,
  resolvedLogo,
  captureUrl,
  expanded,
  showComments,
  showSimilarReports,
  showFullText,
  showCapturePreview,
  visibleDescriptionsCount,
  commentsCount,
  effectiveReportIds,
  onToggleExpanded,
  onToggleComments,
  onToggleSimilarReports,
  onToggleFullText,
  onOpenCapture,
  onCloseCapture,
  onRefreshComments,
  onShowMoreSimilar,
  onShowLessSimilar,
}) => {
  const descriptionText = showFullText
    ? `${initialDescription.description} ${initialDescription.emoji || ""}`.trim()
    : `${initialDescription.description.slice(0, PREVIEW_LENGTH)}${
        initialDescription.description.length > PREVIEW_LENGTH ? "…" : ""
      }`.trim();

  const hasMoreText = initialDescription.description.length > PREVIEW_LENGTH;

  return (
    <div
      className={`flat-subcategory-mobile ${expanded ? "open" : ""}`}
      data-description-id={initialDescription.id}
    >
      <button
        type="button"
        className="flat-subcategory-mobile__header"
        onClick={onToggleExpanded}
      >
        <div className="flat-subcategory-mobile__left">
          <img
            src={getCategoryIconPathFromSubcategory(subcategory)}
            alt={subcategory}
            className="flat-subcategory-mobile__icon"
          />
          <div className="flat-subcategory-mobile__title-wrap">
            <h4>
              {subcategory?.trim().length
                ? subcategory
                : initialDescription?.title || "Autre problème"}
            </h4>
            <span className="flat-subcategory-mobile__date">
              {formatDistanceToNow(new Date(initialDescription.createdAt), {
                locale: fr,
                addSuffix: true,
              }).replace("environ ", "")}
            </span>
          </div>
        </div>

        <div className="flat-subcategory-mobile__right">
          {descriptions.length > 1 && (
            <span className="flat-subcategory-mobile__count">
              {descriptions.length}
            </span>
          )}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="flat-subcategory-mobile__content">
          <div className="flat-subcategory-mobile__meta">
            <div className="flat-subcategory-mobile__avatar-container">
              <Avatar
                avatar={safeAuthor.avatar}
                pseudo={safeAuthor.pseudo}
                type="user"
                className="flat-subcategory-mobile__avatar"
                sizeHW={36}
              />
              <Avatar
                avatar={resolvedLogo}
                pseudo={brand}
                type="brand"
                className="flat-subcategory-mobile__avatar"
                preferBrandLogo={true}
                siteUrl={siteUrl}
                sizeHW={36}
              />
            </div>
            <UserBrandLine
              userId={safeAuthor.id ?? undefined}
              email={safeAuthor.email}
              pseudo={safeAuthor.pseudo}
              brand={brand}
              type="report"
            />
          </div>

          <div className="flat-subcategory-mobile__description">
            <p>{descriptionText}</p>

            {(hasMoreText || captureUrl) && (
              <button
                type="button"
                className="flat-subcategory-mobile__toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFullText();
                }}
              >
                {showFullText ? "Voir moins" : "Voir plus"}
              </button>
            )}

            {showFullText && captureUrl && (
              <div className="flat-subcategory-mobile__capture-wrap">
                <img
                  src={captureUrl}
                  alt="Capture du signalement"
                  className="flat-subcategory-mobile__capture"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCapture();
                  }}
                />

                {showCapturePreview && (
                  <div
                    className="flat-subcategory-mobile__lightbox"
                    onClick={onCloseCapture}
                  >
                    <div
                      className="flat-subcategory-mobile__lightbox-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CloseButton closeFunction={onCloseCapture} />
                      <img src={captureUrl} alt="Aperçu capture" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <ReportActionsBarWithReactions
            userId={initialDescription.user?.id}
            type="report"
            descriptionId={initialDescription.id}
            reportsCount={descriptions.length}
            commentsCount={commentsCount}
            hasBrandResponse={hasBrandResponse}
            status={status}
            onReactClick={() => {}}
            onCommentClick={onToggleComments}
            onToggleSimilarReports={onToggleSimilarReports}
          />

          {showComments && (
            <CommentSection
              key="comment-input-mobile"
              descriptionId={initialDescription.id}
              type="report"
              brand={brand}
              brandSiteUrl={siteUrl}
              brandResponse={hasBrandResponse}
              reportIds={effectiveReportIds}
              onCommentAdded={onRefreshComments}
              onCommentDeleted={onRefreshComments}
            />
          )}

          {showSimilarReports && descriptions.length > 1 && (
            <div className="flat-subcategory-mobile__others">
              {descriptions
                .slice(1, 1 + visibleDescriptionsCount)
                .map((desc: any) => {
                  const similarAuthor = {
                    id: desc.author?.id ?? null,
                    pseudo: desc.author?.pseudo ?? "Utilisateur",
                    avatar: desc.author?.avatar ?? null,
                  };

                  return (
                    <div
                      key={desc.id}
                      className="flat-subcategory-mobile__item"
                    >
                      <div className="flat-subcategory-mobile__item-meta">
                        <Avatar
                          avatar={similarAuthor.avatar}
                          pseudo={similarAuthor.pseudo}
                          type="user"
                          className="flat-subcategory-mobile__item-avatar"
                        />
                        <span className="flat-subcategory-mobile__item-pseudo">
                          {similarAuthor.pseudo}
                        </span>
                        <span className="flat-subcategory-mobile__item-time">
                          {formatDistanceToNow(new Date(desc.createdAt), {
                            locale: fr,
                            addSuffix: true,
                          })}
                        </span>
                      </div>

                      <p className="flat-subcategory-mobile__item-text">
                        {desc.description}
                      </p>

                      <DescriptionCommentSection
                        userId={similarAuthor.id}
                        descriptionId={desc.id}
                        type="report"
                        modeCompact
                        triggerType="text"
                      />
                    </div>
                  );
                })}

              {descriptions.length - 1 > 2 && (
                <div className="flat-subcategory-mobile__others-actions">
                  {visibleDescriptionsCount < descriptions.length - 1 ? (
                    <button type="button" onClick={onShowMoreSimilar}>
                      Voir plus
                    </button>
                  ) : (
                    <button type="button" onClick={onShowLessSimilar}>
                      Voir moins
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlatSubcategoryBlockMobile;
