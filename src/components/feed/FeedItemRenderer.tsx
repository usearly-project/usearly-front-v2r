import type { FeedItem } from "@src/types/feedItem";
import InteractiveFeedbackCard from "../InteractiveFeedbackCard/InteractiveFeedbackCard";
import PopularReportCard from "../report-grouped/reports-popular/PopularReportCard";
import { getBrandLogo } from "@src/utils/brandLogos";
import { normalizeBrandResponse } from "@src/utils/brandResponse";

interface Props {
  item: FeedItem;
  isOpen: boolean;
  isPublic?: boolean;
}

function FeedItemRenderer({ item, isOpen, isPublic = false }: Props) {
  if (item.type === "report") {
    const raw = item.data.hasBrandResponse;

    let finalBrandResponse = null;

    if (raw) {
      const enrichedRaw = {
        ...raw,
        avatar: getBrandLogo(item.data.marque, item.data.siteUrl ?? undefined),
      };

      const normalized = normalizeBrandResponse(enrichedRaw, {
        brand: item.data.marque,
        siteUrl: item.data.siteUrl ?? null,
        avatar: enrichedRaw.avatar,
      });

      // 🔥 LA CLÉ EST ICI
      if (normalized && typeof normalized === "object") {
        finalBrandResponse = {
          ...normalized,
          message: raw.message,
          createdAt: raw.createdAt,
        };
      }
    }
    const adaptedReport = {
      reportingId: item.data.reportingId,
      marque: item.data.marque,
      siteUrl: item.data.siteUrl,
      subCategory: item.data.subCategory,
      status: "open",
      count: item.data.reportsCount,
      solutionsCount: item.data.solutionsCount,
      hasBrandResponse: finalBrandResponse,

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
    console.log("ADAPTED 👉", adaptedReport);
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
