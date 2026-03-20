import { useEffect, useState } from "react";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { formatDistance, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { UserGroupedReport } from "@src/types/Reports";
import "./UserBrandBlock.scss";
import ReportActionsBarWithReactions from "../shared/ReportActionsBarWithReactions";
import { getCommentsCountForDescription } from "@src/services/commentService";
import CommentSection from "../comments/CommentSection";
import { parseISO, isAfter } from "date-fns";
import Avatar from "../shared/Avatar";
import { useAuth } from "@src/services/AuthContext";
import UserBrandLine from "../shared/UserBrandLine";
import CloseButton from "../buttons/CloseButtons";
import SolutionModal from "../ui/SolutionModal";
import SolutionsModal from "../ui/SolutionsModal";

interface Props {
  brand: string;
  siteUrl: string;
  reports: UserGroupedReport[];
  isOpen: boolean;
  onToggle: () => void;
}

const UserBrandBlock: React.FC<Props> = ({
  brand,
  reports,
  isOpen,
  onToggle,
  siteUrl,
}) => {
  const { userProfile } = useAuth();

  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [expandedOthers, setExpandedOthers] = useState<Record<string, boolean>>(
    {},
  );
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [showReactions, setShowReactions] = useState<Record<string, boolean>>(
    {},
  );
  const [showFullText, setShowFullText] = useState<Record<string, boolean>>({});
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [showSolutionModal, setShowSolutionModal] = useState(false);
  const [showSolutionsList, setShowSolutionsList] = useState(false);
  const [, setCommentsCounts] = useState<Record<string, number>>({});
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});
  const [refreshCommentsKeys, setRefreshCommentsKeys] = useState<
    Record<string, number>
  >({});
  const [signalementFilters, setSignalementFilters] = useState<
    Record<string, "pertinent" | "recents" | "anciens">
  >({});

  useEffect(() => {
    const fetchAllCounts = async () => {
      const newCounts: Record<string, number> = {};
      for (const sub of reports) {
        for (const desc of sub.descriptions) {
          try {
            const res = await getCommentsCountForDescription(desc.id);
            newCounts[desc.id] = res.data.commentsCount ?? 0;
          } catch (err) {
            console.error(`Erreur pour descriptionId ${desc.id} :`, err);
            newCounts[desc.id] = 0;
          }
        }
      }
      setCommentsCounts(newCounts);
      setLocalCommentsCounts(newCounts);
    };
    fetchAllCounts();
  }, [reports]);

  const getMostRecentDate = () => {
    let latest: Date | null = null;

    for (const sub of reports) {
      for (const desc of sub.descriptions) {
        const date = parseISO(desc.createdAt);
        if (!latest || isAfter(date, latest)) {
          latest = date;
        }
      }
    }

    return latest;
  };

  const mostRecentDate = getMostRecentDate();

  return (
    <div className={`brand-block ${isOpen ? "open" : "close"}`}>
      <div className="brand-header" onClick={onToggle}>
        <p className="brand-reports-count">
          <strong>{reports.length}</strong> signalement
          {reports.length > 1 ? "s" : ""} sur <strong>{brand}</strong>
        </p>
        <p className="date-card">
          {mostRecentDate
            ? `Il y a ${formatDistance(mostRecentDate, new Date(), {
                locale: fr,
                includeSeconds: true,
              }).replace("environ ", "")}`
            : "Date inconnue"}
        </p>
        <Avatar
          avatar={null}
          pseudo={brand}
          type="brand"
          siteUrl={siteUrl}
          wrapperClassName="avatar brand-logo"
        />
        <ChevronDown size={18} className="chevron-icon" />
      </div>

      {isOpen && (
        <div className="subcategories-list">
          {reports.map((sub) => {
            const initialDescription = sub.descriptions[0];
            const solutionsCount = sub.solutionsCount ?? 0;
            const safeAuthor = {
              id: initialDescription.author?.id ?? null,
              pseudo: initialDescription.author?.pseudo ?? "Utilisateur",
              avatar: initialDescription.author?.avatar ?? null,
              email: initialDescription.author?.email ?? undefined,
            };

            const currentCount =
              localCommentsCounts[initialDescription.id] ?? 0;

            const additionalDescriptions = sub.descriptions.slice(1);
            const hasMoreThanTwo = additionalDescriptions.length > 2;
            const sortedDescriptions = [...additionalDescriptions].sort(
              (a, b) => {
                const filter =
                  signalementFilters[sub.subCategory] || "pertinent";
                if (filter === "recents")
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                if (filter === "anciens")
                  return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                  );
                return 0;
              },
            );

            const displayedDescriptions = expandedOthers[sub.subCategory]
              ? showAll[sub.subCategory]
                ? sortedDescriptions
                : sortedDescriptions.slice(0, 2)
              : [];

            return (
              <div
                key={sub.subCategory}
                className={`subcategory-block ${
                  expandedSub === sub.subCategory ? "open" : ""
                }`}
              >
                <div
                  className="subcategory-header"
                  onClick={() =>
                    setExpandedSub((prev) =>
                      prev === sub.subCategory ? null : sub.subCategory,
                    )
                  }
                >
                  <div className="subcategory-left">
                    <img
                      src={getCategoryIconPathFromSubcategory(sub.subCategory)}
                      alt={sub.subCategory}
                      className="subcategory-icon"
                    />
                    <h4>{sub.subCategory}</h4>
                  </div>
                  <div className="subcategory-right">
                    {expandedSub !== sub.subCategory && (
                      <div className="badge-count">{sub.count}</div>
                    )}
                    {expandedSub !== sub.subCategory && (
                      <span className="date-subcategory">
                        {formatDistanceToNow(
                          new Date(initialDescription.createdAt),
                          {
                            locale: fr,
                            addSuffix: true,
                          },
                        ).replace("environ ", "")}
                      </span>
                    )}
                    {sub.subCategory === expandedSub && (
                      <div className="subcategory-user-brand-info">
                        <div className="avatars-row">
                          <Avatar
                            avatar={safeAuthor.avatar}
                            pseudo={safeAuthor.pseudo || "Utilisateur"}
                            type="user"
                            wrapperClassName="avatar user-avatar"
                          />{" "}
                          <Avatar
                            avatar={null}
                            pseudo={brand}
                            type="brand"
                            siteUrl={siteUrl}
                            wrapperClassName="avatar brand-logo"
                          />
                        </div>
                        <div className="user-brand-names">
                          <UserBrandLine
                            userId={safeAuthor.id}
                            email={safeAuthor.email}
                            pseudo={safeAuthor.pseudo}
                            brand={brand}
                            type="report"
                          />
                        </div>
                      </div>
                    )}

                    {expandedSub === sub.subCategory ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>

                {expandedSub === sub.subCategory && (
                  <div className="subcategory-content">
                    <div className="main-description">
                      <p className="description-text">
                        {showFullText[sub.subCategory]
                          ? `${initialDescription.description} ${initialDescription.emoji || ""}`
                          : `${initialDescription.description.slice(0, 100)}${
                              initialDescription.description.length > 100
                                ? "…"
                                : ""
                            }`}{" "}
                        {(initialDescription.description.length > 100 ||
                          initialDescription.capture) && (
                          <span
                            className={`see-more-section ${showFullText ? "expanded" : ""}`}
                            style={{ display: "inline" }}
                          >
                            {showFullText && <br />}
                            {!showFullText[sub.subCategory] &&
                              initialDescription.description.length > 100 &&
                              "\u00A0"}
                            <button
                              className={`see-more-button ${showFullText ? "expanded" : "not-expanded"}`}
                              style={showFullText ? { marginTop: "5px" } : {}}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFullText((prev) => ({
                                  ...prev,
                                  [sub.subCategory]: !prev[sub.subCategory],
                                }));
                              }}
                            >
                              {showFullText[sub.subCategory]
                                ? "Voir moins"
                                : "Voir plus"}
                            </button>
                          </span>
                        )}
                        {showFullText[sub.subCategory] &&
                          initialDescription.capture && (
                            <div className="inline-capture">
                              <img
                                src={initialDescription.capture}
                                alt="Capture du signalement"
                                className="inline-capture-img"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalImage(initialDescription.capture);
                                }}
                              />
                            </div>
                          )}
                      </p>
                    </div>

                    <ReportActionsBarWithReactions
                      userId={userProfile?.id || ""}
                      type="report"
                      descriptionId={initialDescription.id}
                      status={sub.status}
                      reportsCount={sub.count}
                      hasBrandResponse={sub.hasBrandResponse}
                      commentsCount={currentCount}
                      solutionsCount={solutionsCount}
                      onReactClick={() =>
                        setShowReactions((prev) => ({
                          ...prev,
                          [sub.subCategory]: !prev[sub.subCategory],
                        }))
                      }
                      onCommentClick={() => {
                        setShowComments((prev) => {
                          const newState = !prev[sub.subCategory];
                          if (newState) setExpandedOthers({});
                          return { ...prev, [sub.subCategory]: newState };
                        });
                      }}
                      onToggleSimilarReports={() => {
                        setExpandedOthers((prev) => ({
                          ...prev,
                          [sub.subCategory]: !prev[sub.subCategory],
                        }));
                        setShowComments({});
                      }}
                      onOpenSolutionModal={() => {
                        setActiveReportId(sub.reportingId);

                        if (solutionsCount > 0) {
                          setShowSolutionsList(true);
                        } else {
                          setShowSolutionModal(true);
                        }
                      }}
                    />

                    {showComments[sub.subCategory] && userProfile?.id && (
                      <>
                        <CommentSection
                          descriptionId={initialDescription.id}
                          type="report"
                          brand={brand}
                          brandSiteUrl={siteUrl}
                          brandResponse={sub.hasBrandResponse}
                          reportIds={[sub.reportingId]}
                          onCommentAdded={() => {
                            setLocalCommentsCounts((prev) => ({
                              ...prev,
                              [initialDescription.id]:
                                (prev[initialDescription.id] ?? 0) + 1,
                            }));
                            setRefreshCommentsKeys((prev) => ({
                              ...prev,
                              [initialDescription.id]:
                                (prev[initialDescription.id] ?? 0) + 1,
                            }));
                          }}
                          onCommentDeleted={() => {
                            setLocalCommentsCounts((prev) => ({
                              ...prev,
                              [initialDescription.id]: Math.max(
                                (prev[initialDescription.id] ?? 1) - 1,
                                0,
                              ),
                            }));
                            setRefreshCommentsKeys((prev) => ({
                              ...prev,
                              [initialDescription.id]:
                                (prev[initialDescription.id] ?? 0) + 1,
                            }));
                          }}
                        />

                        <DescriptionCommentSection
                          userId={userProfile.id}
                          descriptionId={initialDescription.id}
                          type="report"
                          hideFooter={true}
                          brand={brand}
                          brandSiteUrl={siteUrl}
                          brandResponse={sub.hasBrandResponse}
                          reportIds={
                            sub.hasBrandResponse ? [sub.reportingId] : []
                          }
                          refreshKey={
                            refreshCommentsKeys[initialDescription.id] ?? 0
                          }
                        />
                      </>
                    )}

                    {showReactions[sub.subCategory] && userProfile?.id && (
                      <DescriptionCommentSection
                        userId={userProfile.id}
                        descriptionId={initialDescription.id}
                        type="report"
                        modeCompact
                        brand={brand}
                        brandSiteUrl={siteUrl}
                        brandResponse={sub.hasBrandResponse}
                        reportIds={
                          sub.hasBrandResponse ? [sub.reportingId] : []
                        }
                      />
                    )}

                    {expandedOthers[sub.subCategory] && (
                      <>
                        <div className="other-descriptions">
                          <div className="signalement-filter">
                            <label
                              htmlFor={`filter-${sub.subCategory}`}
                              className="filter-label"
                            >
                              Tous les signalements :
                            </label>
                            <select
                              id={`filter-${sub.subCategory}`}
                              value={
                                signalementFilters[sub.subCategory] ||
                                "pertinent"
                              }
                              onChange={(e) => {
                                setSignalementFilters((prev) => ({
                                  ...prev,
                                  [sub.subCategory]: e.target.value as
                                    | "pertinent"
                                    | "recents"
                                    | "anciens",
                                }));
                              }}
                              className="filter-select"
                            >
                              <option value="pertinent">
                                Les plus pertinents
                              </option>
                              <option value="recents">Les plus récents</option>
                              <option value="anciens">Les plus anciens</option>
                            </select>
                          </div>
                          {displayedDescriptions.map((desc) => (
                            <div className="feedback-card" key={desc.id}>
                              <div className="feedback-avatar">
                                <div className="feedback-avatar-wrapper">
                                  <Avatar
                                    avatar={desc.author?.avatar || null}
                                    pseudo={desc.author?.pseudo || "?"}
                                    type="user"
                                    className="avatar"
                                    wrapperClassName="avatar-wrapper-override"
                                  />
                                  {desc.emoji && (
                                    <div className="emoji-overlay">
                                      {desc.emoji}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="feedback-content">
                                <div className="feedback-meta">
                                  <span className="pseudo">
                                    {desc.author?.pseudo || "Utilisateur"}
                                  </span>

                                  {userProfile?.id &&
                                    desc.author?.id &&
                                    userProfile.id === desc.author.id && (
                                      <span className="badge-me">Moi</span>
                                    )}

                                  <span className="brand"> · {brand}</span>
                                  <span className="time">
                                    {" "}
                                    ·{" "}
                                    {formatDistanceToNow(
                                      new Date(desc.createdAt),
                                      { locale: fr, addSuffix: true },
                                    )}
                                  </span>
                                </div>
                                <p className="feedback-text">
                                  {desc.description}
                                </p>
                                {userProfile?.id && desc.id && (
                                  <DescriptionCommentSection
                                    userId={userProfile.id}
                                    descriptionId={desc.id}
                                    type="report"
                                    modeCompact
                                    triggerType="text"
                                    brand={brand}
                                    brandSiteUrl={siteUrl}
                                    brandResponse={sub.hasBrandResponse}
                                    reportIds={
                                      sub.hasBrandResponse
                                        ? [sub.reportingId]
                                        : []
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {hasMoreThanTwo && !showAll[sub.subCategory] && (
                          <button
                            className="see-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAll((prev) => ({
                                ...prev,
                                [sub.subCategory]: true,
                              }));
                            }}
                          >
                            <ChevronDown size={14} /> Afficher plus de
                            signalements
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalImage && (
        <div className="lightbox" onClick={() => setModalImage(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton stateSetter={setModalImage} stateValue={null} />
            {/* <button className="close-btn" onClick={() => setModalImage(null)}>
              ✕
            </button> */}
            <img src={modalImage} alt="Aperçu capture" />
          </div>
        </div>
      )}
      {showSolutionModal && activeReportId && (
        <SolutionModal
          reportId={activeReportId}
          onClose={() => setShowSolutionModal(false)}
          onSuccess={() => {
            // optionnel: refresh
          }}
        />
      )}
      {showSolutionsList && activeReportId && (
        <SolutionsModal
          reportId={activeReportId}
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

export default UserBrandBlock;
