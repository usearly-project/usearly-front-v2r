import Avatar from "@src/components/shared/Avatar";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  additionalDescriptions: any[];
  visibleDescriptionsCount: number;
  setVisibleDescriptionsCount: React.Dispatch<React.SetStateAction<number>>;
  isPublic: boolean;
  item: any;
  showSimilarReports: boolean;
}

const PopularReportSimilar: React.FC<Props> = ({
  additionalDescriptions,
  visibleDescriptionsCount,
  setVisibleDescriptionsCount,
  isPublic,
  item,
  showSimilarReports,
}) => {
  if (!showSimilarReports || additionalDescriptions.length === 0) return null;

  const hasMoreThanTwo = additionalDescriptions.length > 2;

  return (
    <div className="other-descriptions">
      {additionalDescriptions.slice(0, visibleDescriptionsCount).map((desc) => {
        const author = desc.author ?? {
          id: "",
          pseudo: "Utilisateur",
          avatar: null,
        };

        return (
          <div key={desc.id} className="feedback-card">
            <div className="feedback-avatar">
              <div className="feedback-avatar-wrapper">
                <Avatar
                  avatar={author.avatar}
                  pseudo={author.pseudo}
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
                <span className="pseudo">{author.pseudo}</span>
                <span className="brand"> · {item.marque}</span>

                <span className="time">
                  ·{" "}
                  {desc.createdAt && !isNaN(new Date(desc.createdAt).getTime())
                    ? formatDistanceToNow(new Date(desc.createdAt), {
                        locale: fr,
                        addSuffix: true,
                      })
                    : ""}
                </span>
              </div>

              <p className="feedback-text">{desc.description}</p>

              {!isPublic && (
                <DescriptionCommentSection
                  userId={author.id}
                  descriptionId={desc.id}
                  type="report"
                  modeCompact
                  triggerType="text"
                />
              )}
            </div>
          </div>
        );
      })}

      {hasMoreThanTwo && (
        <div className="see-more-toggle">
          {visibleDescriptionsCount < additionalDescriptions.length ? (
            <button
              className="see-more-descriptions"
              onClick={() =>
                setVisibleDescriptionsCount((prev) =>
                  Math.min(prev + 2, additionalDescriptions.length),
                )
              }
            >
              Voir plus
            </button>
          ) : (
            <button
              className="see-more-descriptions"
              onClick={() => setVisibleDescriptionsCount(2)}
            >
              Voir moins
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PopularReportSimilar;
