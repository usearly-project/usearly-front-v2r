import { ChevronDown, ChevronUp } from "lucide-react";
import type {
  ExplodedGroupedReport,
  FeedbackDescription,
} from "@src/types/Reports";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import Avatar from "@src/components/shared/Avatar";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import "./FeedbackReportMobile.scss";

interface Props {
  item: ExplodedGroupedReport & { brandLogoUrl?: string };
  firstDescription: FeedbackDescription;
  descriptionId: string;
  descriptionText: string;
  formattedDate: string;
  isOpen: boolean;
  showComments: boolean;
  showFullText: boolean;
  canToggleFullText: boolean;
  showCapturePreview: boolean;
  currentCount: number;
  userId: string;
  onToggle: () => void;
  onCommentClick: () => void;
  onToggleFullText: () => void;
  onOpenCapture: () => void;
  onCloseCapture: () => void;
  onCommentCountChange: (count: number) => void;
  onCommentAddedOrDeleted: () => void;
}

const FeedbackReportMobile: React.FC<Props> = ({
  item,
  firstDescription,
  descriptionId,
  descriptionText,
  formattedDate,
  isOpen,
  showComments,
  showFullText,
  canToggleFullText,
  showCapturePreview,
  currentCount,
  userId,
  onToggle,
  onCommentClick,
  onToggleFullText,
  onOpenCapture,
  onCloseCapture,
  onCommentCountChange,
  onCommentAddedOrDeleted,
}) => {
  return (
    <div className={`feedback-report-mobile ${isOpen ? "open" : ""}`}>
      <h1>aodhzoiadiazdizadoiazoidbz</h1>
      <button
        type="button"
        className="feedback-report-mobile__header"
        onClick={onToggle}
      >
        <div className="feedback-report-mobile__left">
          <img
            src={getCategoryIconPathFromSubcategory(
              item.subCategory.subCategory,
            )}
            className="feedback-report-mobile__icon"
            alt="icon catégorie"
          />
          <div className="feedback-report-mobile__title-wrap">
            <h4 className="feedback-report-mobile__title">
              {item.subCategory.subCategory}
            </h4>
            <span className="feedback-report-mobile__date">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="feedback-report-mobile__right">
          {item.subCategory.descriptions.length > 1 && (
            <span className="feedback-report-mobile__count">
              {item.subCategory.descriptions.length}
            </span>
          )}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {isOpen && (
        <div className="feedback-report-mobile__content">
          <div className="feedback-report-mobile__meta">
            <Avatar
              avatar={firstDescription.author?.avatar ?? null}
              pseudo={firstDescription.author?.pseudo}
              type="user"
              className="feedback-report-mobile__avatar"
            />
            <Avatar
              avatar={item.brandLogoUrl ?? null}
              pseudo={item.marque}
              type="brand"
              className="feedback-report-mobile__avatar"
            />
            <UserBrandLine
              userId={firstDescription.author?.id}
              email={firstDescription.author?.email}
              pseudo={firstDescription.author?.pseudo}
              brand={item.marque}
              type="report"
            />
          </div>

          <div className="feedback-report-mobile__description-wrap">
            <p className="feedback-report-mobile__description">
              {descriptionText}
            </p>

            {showFullText && item.capture && (
              <img
                src={item.capture ?? undefined}
                alt="Aperçu"
                className="feedback-report-mobile__capture"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCapture();
                }}
              />
            )}

            {canToggleFullText && (
              <button
                type="button"
                className="feedback-report-mobile__toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFullText();
                }}
              >
                {showFullText ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </div>

          <ReportActionsBarWithReactions
            userId={userId}
            type="report"
            descriptionId={descriptionId}
            hasBrandResponse={item.hasBrandResponse}
            reportsCount={item.subCategory.count}
            commentsCount={currentCount}
            status={item.subCategory.status}
            onReactClick={() => {}}
            onCommentClick={onCommentClick}
            onToggleSimilarReports={() => {}}
          />

          {userId && (
            <DescriptionCommentSection
              userId={userId}
              descriptionId={descriptionId}
              type="report"
              brand={item.marque}
              brandSiteUrl={item.siteUrl ?? undefined}
              brandResponse={item.hasBrandResponse}
              hideFooter={true}
              forceOpen={showComments}
              reportIds={item.hasBrandResponse ? [item.reportingId] : []}
              onCommentCountChange={onCommentCountChange}
              onCommentAddedOrDeleted={onCommentAddedOrDeleted}
            />
          )}
        </div>
      )}

      {showCapturePreview && item.capture && (
        <div
          className="feedback-report-mobile__overlay"
          onClick={onCloseCapture}
        >
          <div
            className="feedback-report-mobile__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="feedback-report-mobile__close"
              onClick={onCloseCapture}
            >
              ✕
            </button>
            <img
              src={item.capture ?? undefined}
              alt="Capture zoom"
              className="feedback-report-mobile__modal-img"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackReportMobile;
