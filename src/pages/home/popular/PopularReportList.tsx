import type { PopularReport, PopularGroupedReport } from "@src/types/Reports";
import PopularReportCard from "@src/components/report-grouped/reports-popular/PopularReportCard";
import { useState } from "react";

const PopularReportList = ({
  data,
  expandedItems,
  /* handleToggle, */
  loading,
}: {
  data: PopularReport[];
  expandedItems: Record<string, boolean>;
  //handleToggle: (key: string) => void;
  loading: boolean;
}) => {
  const [, setSelectedReportId] = useState<string | null>(null);
  // ✅ On attend que le chargement soit terminé pour afficher le message vide
  if (!loading && (!data || data.length === 0)) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
        Aucun signalement populaire disponible.
      </div>
    );
  }

  return (
    <>
      {data.map((item) => {
        const key = `${item.reportingId}-${item.id}`;
        console.log("🔥 RAGE ITEM FINAL 👉", item);
        // 🔹 Normalisation en PopularGroupedReport
        const normalized: PopularGroupedReport = {
          reportingId: item.reportingId,
          marque: item.marque,
          siteUrl: item.siteUrl ?? undefined,
          status: item.status,
          category: item.category,
          subCategory: item.subCategory,
          createdAt: item.createdAt,
          count: 1,
          solutionsCount: item.solutionsCount ?? 0,
          descriptions: [
            {
              id: item.id,
              description: item.description,
              emoji: item.reactions?.[0]?.emoji ?? "",
              createdAt: item.createdAt,
              author: item.author ?? {
                id: "0",
                pseudo: "Anonyme",
                avatar: null,
              },
              reportingId: item.reportingId,
              capture: item.capture,
              marque: item.marque,
              reactions: item.reactions,
            },
          ],
        };

        return (
          <PopularReportCard
            key={key}
            item={normalized}
            isOpen={!!expandedItems[key]}
            isHot={false}
            onOpenSolutionModal={() => {
              console.log("OPEN MODAL 👉", item.reportingId);
              setSelectedReportId(item.reportingId);
            }}
          />
        );
      })}
    </>
  );
};

export default PopularReportList;
