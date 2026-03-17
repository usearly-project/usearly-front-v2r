import type { FeedItem } from "@src/types/feedItem";
import InteractiveFeedbackCard from "../InteractiveFeedbackCard/InteractiveFeedbackCard";
import PopularReportCard from "../report-grouped/reports-popular/PopularReportCard";

interface Props {
  item: FeedItem;
  isOpen: boolean;
  isPublic?: boolean;
}

function FeedItemRenderer({ item, isOpen, isPublic = false }: Props) {
  if (item.type === "report") {
    const adaptedReport = {
      reportingId: item.data.reportingId,
      marque: item.data.marque,
      siteUrl: item.data.siteUrl,
      subCategory: item.data.subCategory,
      status: "open",
      count: item.data.reportsCount,
      solutionsCount: item.data.solutionsCount,

      descriptions: [
        {
          id: item.data.descriptionId,
          description: item.data.description,
          emoji: item.data.emoji,
          createdAt: item.data.latestActivityAt || item.data.createdAt,
          capture: item.data.capture ?? null,
          author: item.data.author,
          reactions: [],
          comments: [],
        },

        ...(item.data.reporters ?? []).map((r: any) => ({
          id: r.descriptionId,
          description: r.description,
          emoji: r.emoji,
          createdAt: r.createdAt, // 🔥 FIX ICI
          capture: null,
          author: {
            id: r.id,
            pseudo: r.pseudo,
            avatar: r.avatar,
          },
          reactions: [],
          comments: [],
        })),
      ],
    };
    return (
      <PopularReportCard
        item={adaptedReport as any}
        isOpen={isOpen}
        isPublic={isPublic}
        onOpenSolutionModal={() => {}}
      />
    );
  }

  if (item.type === "suggestion") {
    return (
      <InteractiveFeedbackCard
        item={{
          ...item.data,
          type: "suggestion",
        }}
        isOpen={isOpen}
      />
    );
  }

  if (item.type === "cdc") {
    return (
      <InteractiveFeedbackCard
        item={{
          ...item.data,
          type: "coupdecoeur",
        }}
        isOpen={isOpen}
      />
    );
  }

  return null;
}

export default FeedItemRenderer;
