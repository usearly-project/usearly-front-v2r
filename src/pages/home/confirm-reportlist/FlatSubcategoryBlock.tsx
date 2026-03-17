import { useEffect, useState } from "react";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./FlatSubcategoryBlock.scss";
import CommentSection from "@src/components/comments/CommentSection";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import Avatar from "@src/components/shared/Avatar";
import {
  normalizeDomain,
  FALLBACK_BRAND_PLACEHOLDER,
} from "@src/utils/brandLogos";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import CloseButton from "@src/components/buttons/CloseButtons";
import type { TicketStatusKey } from "@src/types/ticketStatus";
import type { HasBrandResponse } from "@src/types/brandResponse";
import { useIsMobile } from "@src/hooks/use-mobile";
import FlatSubcategoryBlockMobile from "./FlatSubcategoryBlockMobile";
import SolutionModal from "@src/components/ui/SolutionModal";
import SolutionsModal from "@src/components/ui/SolutionsModal";

interface Props {
  brand: string;
  siteUrl?: string;
  subcategory: string;
  reportId?: string; // ✅ tous les écrans existants
  reportIds?: string[]; // ✅ UNIQUEMENT BrandFilteredSection
  status: TicketStatusKey;
  capture?: string | null;
  descriptions: any[];
  hasBrandResponse?: HasBrandResponse;
  hideFooter?: boolean;
  forceOpenComments?: boolean;
  solutionsCount?: number;
}

const FlatSubcategoryBlock: React.FC<Props> = ({
  brand,
  siteUrl,
  subcategory,
  reportId,
  reportIds,
  descriptions,
  hasBrandResponse,
  status,
  capture,
  forceOpenComments = false,
  solutionsCount: solutionsCountProp,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showSimilarReports, setShowSimilarReports] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [visibleDescriptionsCount, setVisibleDescriptionsCount] = useState(2);
  const [showFullText, setShowFullText] = useState(false);
  const initialDescription = descriptions?.[0];
  const [showCapturePreview, setShowCapturePreview] = useState(false);
  const isMobile = useIsMobile();
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showSolutionsList, setShowSolutionsList] = useState(false);
  const [solutionsCount, setSolutionsCount] = useState<number>(
    solutionsCountProp ?? 0,
  );

  useEffect(() => {
    setSolutionsCount(solutionsCountProp ?? 0);
  }, [solutionsCountProp]);

  // ✅ Appelé avant tout return
  const brandLogos = useBrandLogos([{ brand, siteUrl }]);

  const { comments } = useCommentsForDescription(
    initialDescription?.id,
    "report",
    refreshKey,
  );
  const effectiveReportIds = reportIds ?? (reportId ? [reportId] : []);

  // ✅ AUTHOR SAFE (aligné API)
  const safeAuthor = {
    id: initialDescription?.author?.id ?? null,
    pseudo: initialDescription?.author?.pseudo ?? "Utilisateur",
    email: initialDescription?.author?.email ?? null,
    avatar: initialDescription?.author?.avatar ?? null,
  };
  const captureUrl = capture || initialDescription?.capture || null;

  useEffect(() => {
    if (window.location.hash === `#${initialDescription?.id}`) {
      setExpanded(true);
      setShowComments(true);
    }
  }, [initialDescription?.id]);

  useEffect(() => {
    if (forceOpenComments) setShowComments(true);
  }, [forceOpenComments]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    setShowComments(false);
    setShowSimilarReports(false);
  };
  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
    setShowSimilarReports(false);
  };
  const handleToggleSimilarReports = () => {
    setShowSimilarReports((prev) => !prev);
    setShowComments(false);
  };
  const handleToggleFullText = () => {
    setShowFullText((prev) => !prev);
  };
  const handleOpenCapture = () => {
    setShowCapturePreview(true);
  };
  const handleCloseCapture = () => {
    setShowCapturePreview(false);
  };
  const handleShowMoreSimilar = () => {
    setVisibleDescriptionsCount((prev) => prev + 2);
  };
  const handleShowLessSimilar = () => {
    setVisibleDescriptionsCount(2);
  };

  // ✅ return après tous les hooks
  if (!initialDescription) return null;

  // 🔧 Assure une clé cohérente
  const normalizedDomain = siteUrl ? normalizeDomain(siteUrl) : "";
  const key = brand.toLowerCase().trim();

  const possibleKeys = [
    key,
    `${key}.com`,
    normalizedDomain,
    `${key}.fr`,
    `${key}.ai`,
  ];

  const resolvedLogo =
    possibleKeys.map((k) => brandLogos[k]).find(Boolean) ||
    FALLBACK_BRAND_PLACEHOLDER;

  if (isMobile) {
    return (
      <FlatSubcategoryBlockMobile
        brand={brand}
        siteUrl={siteUrl}
        subcategory={subcategory}
        status={status}
        descriptions={descriptions}
        hasBrandResponse={hasBrandResponse}
        initialDescription={initialDescription}
        safeAuthor={safeAuthor}
        resolvedLogo={resolvedLogo}
        captureUrl={captureUrl}
        expanded={expanded}
        showComments={showComments}
        showSimilarReports={showSimilarReports}
        showFullText={showFullText}
        showCapturePreview={showCapturePreview}
        visibleDescriptionsCount={visibleDescriptionsCount}
        commentsCount={comments.length}
        effectiveReportIds={effectiveReportIds}
        onToggleExpanded={toggleExpanded}
        onToggleComments={handleToggleComments}
        onToggleSimilarReports={handleToggleSimilarReports}
        onToggleFullText={handleToggleFullText}
        onOpenCapture={handleOpenCapture}
        onCloseCapture={handleCloseCapture}
        onRefreshComments={() => setRefreshKey((p) => p + 1)}
        onShowMoreSimilar={handleShowMoreSimilar}
        onShowLessSimilar={handleShowLessSimilar}
      />
    );
  }

  return (
    <div
      className={`subcategory-block flat ${expanded ? "open" : ""}`}
      data-description-id={initialDescription.id}
    >
      {/* === HEADER === */}
      <div className="subcategory-header" onClick={toggleExpanded}>
        <div className="subcategory-left">
          <img
            src={getCategoryIconPathFromSubcategory(subcategory)}
            alt={subcategory}
            className="subcategory-icon"
          />
          <div className="subcategory-text">
            <div className="subcategory-title-row">
              <h4>
                {subcategory?.trim().length
                  ? subcategory
                  : initialDescription?.title || "Autre problème"}
              </h4>
              <span className="date-badge">
                {formatDistanceToNow(new Date(initialDescription.createdAt), {
                  locale: fr,
                  addSuffix: true,
                })
                  .replace("environ ", "")
                  .replace("il y a ", "")}
              </span>
            </div>
          </div>
        </div>

        <div className="subcategory-right">
          {expanded ? (
            <div className="expanded-header">
              <div className="avatar-logo-group">
                <Avatar
                  avatar={safeAuthor.avatar}
                  pseudo={safeAuthor.pseudo}
                  type="user"
                  className="user-avatar"
                  wrapperClassName="user-avatar-wrapper"
                />
                <Avatar
                  avatar={resolvedLogo}
                  pseudo={brand}
                  type="brand"
                  className="brand-logo"
                  wrapperClassName="brand-logo-wrapper"
                  preferBrandLogo={true}
                  siteUrl={siteUrl}
                />
              </div>
              <div className="text-meta">
                <UserBrandLine
                  userId={safeAuthor.id}
                  email={safeAuthor.email}
                  pseudo={safeAuthor.pseudo}
                  brand={brand}
                  type="report"
                />
              </div>
            </div>
          ) : (
            <div className="collapsed-header">
              <span className="date-subcategory">
                {formatDistanceToNow(new Date(initialDescription.createdAt), {
                  locale: fr,
                  addSuffix: true,
                }).replace("environ ", "")}
              </span>
              <Avatar
                avatar={resolvedLogo}
                pseudo={brand}
                type="brand"
                className="brand-logo"
                wrapperClassName="avatars"
                preferBrandLogo={true}
                siteUrl={siteUrl}
              />
            </div>
          )}
        </div>
      </div>

      {/* === CONTENU === */}
      {expanded && (
        <div className="subcategory-content">
          <div className="main-description">
            <p className="description-text">
              {showFullText
                ? `${initialDescription.description} ${
                    initialDescription.emoji || ""
                  }`
                : `${initialDescription.description.slice(0, 100)}${
                    initialDescription.description.length > 100 ? "…" : ""
                  }`}{" "}
              {(initialDescription.description.length > 100 || captureUrl) && (
                <span
                  className={`see-more-section ${showFullText ? "expanded-section" : ""}`}
                  style={{ display: "inline" }}
                >
                  {showFullText && <br />}
                  {!showFullText &&
                    initialDescription.description.length > 100 &&
                    " "}
                  <button
                    className="see-more-button"
                    style={showFullText ? { marginTop: "5px" } : {}}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFullText();
                    }}
                  >
                    {showFullText ? "Voir moins" : "Voir plus"}
                  </button>
                </span>
              )}
              {showFullText && captureUrl && (
                <div className="inline-capture">
                  <img
                    src={captureUrl}
                    alt="Capture du signalement"
                    className="inline-capture-img"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCapture();
                    }}
                  />

                  {showCapturePreview && (
                    <div className="lightbox" onClick={handleCloseCapture}>
                      <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CloseButton
                          stateSetter={setShowCapturePreview}
                          stateValue={false}
                        />
                        <img src={captureUrl} alt="Aperçu capture" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </p>
          </div>

          <ReportActionsBarWithReactions
            userId={initialDescription.user?.id}
            descriptionId={initialDescription.id}
            reportsCount={descriptions.length}
            commentsCount={comments.length}
            descriptions={descriptions}
            hasBrandResponse={hasBrandResponse}
            status={status}
            type="report"
            solutionsCount={solutionsCount}
            onReactClick={() => {}}
            onCommentClick={handleToggleComments}
            onToggleSimilarReports={handleToggleSimilarReports}
            onOpenSolutionModal={() => {
              if (solutionsCount > 0) {
                setShowSolutionsList(true);
              } else {
                setShowSolutionModal(true);
              }
            }}
          />

          {showComments && (
            <>
              {/* ✍️ INPUT UNIQUE (écriture – ticket logique) */}
              <CommentSection
                key="comment-input"
                descriptionId={initialDescription.id}
                type="report"
                brand={brand}
                brandSiteUrl={siteUrl}
                brandResponse={hasBrandResponse}
                reportIds={effectiveReportIds}
                onCommentAdded={() => setRefreshKey((p) => p + 1)}
                onCommentDeleted={() => setRefreshKey((p) => p + 1)}
              />
            </>
          )}

          {showSimilarReports && descriptions.length > 1 && (
            <div className="other-descriptions">
              {descriptions
                .slice(1, 1 + visibleDescriptionsCount)
                .map((desc) => {
                  const safeAuthor = {
                    id: desc.author?.id ?? null,
                    pseudo: desc.author?.pseudo ?? "Utilisateur",
                    avatar: desc.author?.avatar ?? null,
                  };

                  return (
                    <div key={desc.id} className="feedback-card">
                      <div className="feedback-avatar">
                        <div className="feedback-avatar-wrapper">
                          <Avatar
                            avatar={safeAuthor.avatar}
                            pseudo={safeAuthor.pseudo}
                            type="user"
                            className="avatar"
                            wrapperClassName="avatar-wrapper-override"
                          />

                          {desc.emoji && (
                            <div className="emoji-overlay">{desc.emoji}</div>
                          )}
                        </div>
                      </div>

                      <div className="feedback-content">
                        <div className="feedback-meta">
                          <span className="pseudo">{safeAuthor.pseudo}</span>
                          <span className="time">
                            ·{" "}
                            {formatDistanceToNow(new Date(desc.createdAt), {
                              locale: fr,
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        <p className="feedback-text">{desc.description}</p>

                        <DescriptionCommentSection
                          userId={safeAuthor.id}
                          descriptionId={desc.id}
                          type="report"
                          modeCompact
                          triggerType="text"
                        />
                      </div>
                    </div>
                  );
                })}

              {descriptions.length - 1 > 2 && (
                <div className="see-more-toggle">
                  {visibleDescriptionsCount < descriptions.length - 1 ? (
                    <button
                      className="see-more-descriptions"
                      onClick={handleShowMoreSimilar}
                    >
                      Voir plus
                    </button>
                  ) : (
                    <>
                      <button
                        className="see-more-descriptions"
                        onClick={handleShowLessSimilar}
                      >
                        Voir moins
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {showSolutionModal && (
        <SolutionModal
          reportId={reportId || effectiveReportIds[0]}
          onClose={() => setShowSolutionModal(false)}
          onSuccess={() => {
            setSolutionsCount((prev) => prev + 1);
          }}
        />
      )}
      {showSolutionsList && (
        <SolutionsModal
          reportId={reportId || effectiveReportIds[0]}
          onClose={() => setShowSolutionsList(false)}
          onAddSolution={() => {
            setShowSolutionsList(false);
            setShowSolutionModal(true);
          }}
        />
      )}
    </div>
  );
};

export default FlatSubcategoryBlock;
