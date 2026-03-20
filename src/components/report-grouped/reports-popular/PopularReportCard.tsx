import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@src/services/AuthContext";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import type { PopularGroupedReport } from "@src/types/Reports";
import "./PopularReportCard.scss";
import "@src/pages/home/confirm-reportlist/FlatSubcategoryBlock.scss";
import { getBrandLogo } from "@src/utils/brandLogos";
import PopularReportHeader from "./popular-report-header/PopularReportHeader";
import PopularReportContent from "./popular-report-header/PopularReportContent";
import PopularReportLightbox from "./popular-report-header/PopularReportLightbox";
import PopularReportActions from "./popular-report-header/PopularReportActions";
import PopularReportComments from "./popular-report-header/PopularReportComments";
import PopularReportSimilar from "./popular-report-header/PopularReportSimilar";
import SolutionModal from "@src/components/ui/SolutionModal";
import SolutionsModal from "@src/components/ui/SolutionsModal";

interface Props {
  item: PopularGroupedReport;
  isOpen: boolean;
  isHot?: boolean;
  isPublic?: boolean;
  onOpenSolutionModal: () => void;
}

const DESCRIPTION_PREVIEW_LENGTH = 100;

const PopularReportCard: React.FC<Props> = ({
  item,
  isOpen,
  isHot,
  isPublic = false,
}) => {
  const { userProfile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showSimilarReports, setShowSimilarReports] = useState(false);
  const [visibleDescriptionsCount, setVisibleDescriptionsCount] = useState(2);
  const [showFullText, setShowFullText] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});
  const [showCapturePreview, setShowCapturePreview] = useState(false);
  const firstDescription = item.descriptions?.[0];
  const descriptionId = firstDescription?.id ?? "";
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showSolutionsList, setShowSolutionsList] = useState(false);
  const [showAuthTooltip, setShowAuthTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [solutionsCount, setSolutionsCount] = useState(
    item.solutionsCount ?? 0,
  );
  const shouldFetchComments = !isPublic && descriptionId;

  const { comments, loading } = useCommentsForDescription(
    shouldFetchComments ? descriptionId : undefined,
    "report",
    refreshKey,
  );

  const latestDate = useMemo(() => {
    if (!item.descriptions?.length) return null;

    const latest = item.descriptions.reduce((acc, curr) => {
      return new Date(curr.createdAt) > new Date(acc.createdAt) ? curr : acc;
    });

    return latest.createdAt;
  }, [item.descriptions]);

  useEffect(() => {
    if (!loading) {
      setLocalCommentsCounts((prev) => ({
        ...prev,
        [descriptionId]: comments.length,
      }));
    }
  }, [comments.length, descriptionId, loading]);

  useEffect(() => {
    if (!isOpen) {
      setShowComments(false);
      setShowSimilarReports(false);
      setShowFullText(false);
      setVisibleDescriptionsCount(2);
    }
  }, [isOpen]);

  const descriptionText = useMemo(() => {
    if (!firstDescription) return "";

    if (showFullText || !firstDescription.description) {
      return `${firstDescription.description}${firstDescription.emoji || ""}`;
    }

    const truncated = firstDescription.description.slice(
      0,
      DESCRIPTION_PREVIEW_LENGTH,
    );

    const suffix =
      firstDescription.description.length > DESCRIPTION_PREVIEW_LENGTH
        ? "..."
        : "";

    return `${truncated}${suffix} ${firstDescription.emoji || ""}`.trim();
  }, [firstDescription?.description, firstDescription?.emoji, showFullText]);

  const hasBrandResponse = item.hasBrandResponse || null;

  const author: {
    id: string;
    pseudo: string;
    avatar: string | null;
    email?: string | null; // ✅ ajouté
  } = firstDescription.author ?? {
    id: "",
    pseudo: "Utilisateur",
    avatar: null,
    email: null, // ✅ ajouté ici aussi
  };

  const currentCount = localCommentsCounts[descriptionId] ?? 0;
  const brandLogo = getBrandLogo(item.marque, item.siteUrl ?? undefined);
  const captureUrl = firstDescription.capture ?? null;
  const additionalDescriptions = item.descriptions.slice(1);

  const triggerTooltip = (text: string) => {
    setTooltipText(text);
    setShowAuthTooltip(true);

    setTimeout(() => {
      setShowAuthTooltip(false);
    }, 2000);
  };
  const handleCommentClick = () => {
    if (!userProfile?.id) {
      triggerTooltip("Connecte-toi pour voir la réponse de la marque");
      return; // ⛔ on bloque
    }

    if (!isOpen) {
      setShowComments(true);
      setShowSimilarReports(false);
      return;
    }

    setShowComments((prev) => !prev);
  };

  useEffect(() => {
    setSolutionsCount(item.solutionsCount ?? 0);
  }, [item.solutionsCount]);

  if (!firstDescription) return null;

  const handleToggleSimilarReports = () => {
    if (!isOpen) {
      //onToggle();
      setShowSimilarReports(true);
      setShowComments(false);
      return;
    }

    setShowSimilarReports((prev) => !prev);
    if (!showSimilarReports) {
      setShowComments(false);
    }
  };

  const formattedShortDate = latestDate
    ? formatDistanceToNow(new Date(latestDate), {
        locale: fr,
        addSuffix: false,
      })
        .replace("environ ", "")
        .replace("il y a ", "")
    : "";

  return (
    <div
      className={`subcategory-block flat ${isOpen ? "open" : ""} ${isHot ? "hot-effect" : ""}`}
      data-description-id={descriptionId}
    >
      <PopularReportHeader
        item={item}
        isOpen={isOpen}
        author={author}
        brandLogo={brandLogo}
        formattedShortDate={formattedShortDate}
        firstDescription={firstDescription}
      />

      {isOpen && (
        <div className="subcategory-content">
          <PopularReportContent
            descriptionText={descriptionText}
            showFullText={showFullText}
            setShowFullText={setShowFullText}
            captureUrl={captureUrl}
            descriptionLength={firstDescription.description.length}
            previewLength={DESCRIPTION_PREVIEW_LENGTH}
            setShowCapturePreview={setShowCapturePreview}
          />

          <PopularReportActions
            userProfile={userProfile}
            descriptionId={descriptionId}
            item={item}
            solutionsCount={solutionsCount}
            hasBrandResponse={hasBrandResponse}
            currentCount={currentCount}
            handleCommentClick={handleCommentClick}
            handleToggleSimilarReports={handleToggleSimilarReports}
            onOpenSolutionModal={() => {
              if (solutionsCount > 0) {
                setShowSolutionsList(true); // ✅ ouvre la liste
              } else {
                setShowSolutionModal(true); // ✅ propose une solution
              }
            }}
            isPublic={isPublic}
          />
          {showAuthTooltip && <div className="auth-tooltip">{tooltipText}</div>}
          <PopularReportComments
            userProfile={userProfile}
            descriptionId={descriptionId}
            showComments={showComments}
            setLocalCommentsCounts={setLocalCommentsCounts}
            setRefreshKey={setRefreshKey}
            brandResponse={hasBrandResponse}
          />

          <PopularReportSimilar
            additionalDescriptions={additionalDescriptions}
            visibleDescriptionsCount={visibleDescriptionsCount}
            setVisibleDescriptionsCount={setVisibleDescriptionsCount}
            isPublic={isPublic}
            item={item}
            showSimilarReports={showSimilarReports}
          />
        </div>
      )}
      {showCapturePreview && (
        <PopularReportLightbox
          captureUrl={captureUrl}
          onClose={() => setShowCapturePreview(false)}
        />
      )}

      {showSolutionModal && (
        <SolutionModal
          reportId={item.reportingId}
          onClose={() => setShowSolutionModal(false)}
          onSuccess={() => {
            setSolutionsCount((prev) => prev + 1);
          }}
        />
      )}
      {showSolutionsList && (
        <SolutionsModal
          reportId={item.reportingId}
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

export default PopularReportCard;
