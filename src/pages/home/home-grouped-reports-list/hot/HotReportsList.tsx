import { useMemo } from "react";
import ReportListView from "../../ReportListView";
import type { PopularGroupedReport } from "@src/types/Reports";

const HotReportsList = ({
  data,
  loading,
  expandedItems,
  handleToggle,
  searchTerm,
  onClearSearchTerm,
}: {
  data: Record<string, PopularGroupedReport[]>;
  loading: boolean;
  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;
  searchTerm?: string;
  onClearSearchTerm?: () => void;
}) => {
  const formattedHotData = useMemo(() => {
    const result: Record<string, PopularGroupedReport[]> = {};

    // 🔥 CAS 1 : déjà groupé par date
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      Object.values(data).every((v) => Array.isArray(v))
    ) {
      Object.entries(data).forEach(([date, items]) => {
        result[date] = items.map((item) => ({
          ...item,
          descriptions: Array.isArray(item.descriptions)
            ? item.descriptions
            : [],
          createdAt: item.descriptions?.[0]?.createdAt,
          description: item.descriptions?.[0]?.description,
          reactions: item.descriptions?.[0]?.reactions ?? [],
        }));
      });

      return result;
    }

    // 🔥 CAS 2 : array flat → on regroupe
    if (Array.isArray(data)) {
      data.forEach((item) => {
        const date =
          item.descriptions?.[0]?.createdAt?.slice(0, 10) ?? "unknown";

        if (!result[date]) result[date] = [];

        result[date].push({
          ...item,
          descriptions: Array.isArray(item.descriptions)
            ? item.descriptions
            : [],
          createdAt: item.descriptions?.[0]?.createdAt,
          description: item.descriptions?.[0]?.description,
          reactions: item.descriptions?.[0]?.reactions ?? [],
        });
      });
    }

    return result;
  }, [data]);

  return (
    <ReportListView
      filter="hot"
      viewMode="confirmed"
      flatData={[]}
      chronoData={{}}
      popularData={formattedHotData} // ✅ ICI
      popularEngagementData={{}}
      rageData={{}}
      expandedItems={expandedItems}
      handleToggle={handleToggle}
      loadingChrono={false}
      loadingPopular={loading}
      loadingPopularEngagement={false}
      loadingRage={false}
      searchTerm={searchTerm}
      onClearSearchTerm={onClearSearchTerm}
    />
  );
};

export default HotReportsList;
