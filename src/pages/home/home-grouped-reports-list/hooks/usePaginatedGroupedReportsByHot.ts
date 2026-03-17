import { useEffect, useState } from "react";
import { getGroupedReportsByHot } from "@src/services/feedbackService";
import type { PopularGroupedReport } from "@src/types/Reports";

export const usePaginatedGroupedReportsByHot = (
  active: boolean,
  pageSize = 10,
) => {
  const [data, setData] = useState<PopularGroupedReport[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!active) {
      setData([]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getGroupedReportsByHot(page, pageSize);

        // ✅ BON NIVEAU
        const grouped: Record<string, PopularGroupedReport[]> = res?.data ?? {};

        console.log("🔥 HOT FETCH grouped", grouped);

        const flat = Object.values(grouped).flat();

        setData((prev) => {
          const map = new Map<string, PopularGroupedReport>();

          [...prev, ...flat].forEach((item) => {
            const key = `${item.reportingId}-${item.subCategory}`;
            //map.set(key, item);
            const existing = map.get(key);

            if (!existing) {
              map.set(key, item);
            } else {
              map.set(key, {
                ...existing,
                ...item,

                // 🔥 IMPORTANT : garder la valeur la plus fiable
                solutionsCount: Math.max(
                  existing.solutionsCount ?? 0,
                  item.solutionsCount ?? 0,
                ),
              });
            }
          });

          return Array.from(map.values());
        });

        if (flat.length < pageSize) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("❌ Erreur HOT:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [active, page, pageSize]);

  const loadMore = () => {
    if (!loading && hasMore && active) {
      setPage((prev) => prev + 1);
    }
  };

  return { data, loading, hasMore, loadMore };
};
