import { useEffect, useState, useCallback } from "react";
import { getRageReports } from "@src/services/feedbackService";
import type { ConfirmedSubcategoryReport } from "@src/types/Reports";
import { apiService } from "@src/services/apiService";
import { normalizeBrandResponse } from "@src/utils/brandResponse";

export const usePaginatedGroupedReportsByRage = (
  active: boolean,
  pageSize = 5,
) => {
  const [data, setData] = useState<ConfirmedSubcategoryReport[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = useCallback(async () => {
    if (!active) return;

    setLoading(true);

    try {
      const res = await getRageReports(page, pageSize);
      const newData: ConfirmedSubcategoryReport[] = res.data || [];
      const reportIds = Array.from(new Set(newData.map((d) => d.reportingId)));

      const { data: map } = await apiService.post(
        "/reports/brand-responses-map",
        { reportIds },
      );

      const enriched = newData.map((item) => ({
        ...item,
        solutionsCount: item.solutionsCount ?? 0,
        hasBrandResponse: normalizeBrandResponse(map[item.reportingId], {
          brand: item.marque,
          siteUrl: item.siteUrl ?? null,
        }),
      }));

      setData((prev) => (page === 1 ? enriched : [...prev, ...enriched]));

      // pagination fiable
      setHasMore(page * pageSize < res.total);
    } catch (err) {
      console.error("❌ Erreur chargement rage reports:", err);
    } finally {
      setLoading(false);
    }
  }, [active, page, pageSize]);

  useEffect(() => {
    if (!active) {
      setData([]);
      setPage(1);
      setHasMore(true);
      return;
    }

    fetchData();
  }, [fetchData, active]);

  const loadMore = () => {
    console.log("🟢 loadMore déclenché");
    if (!loading && hasMore && active) {
      setPage((prev) => prev + 1);
    }
  };

  const reset = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
  };

  return { data, loading, hasMore, loadMore, reset };
};
