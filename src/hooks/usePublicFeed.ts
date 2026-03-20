import { getPublicFeed } from "@src/services/feedbackService";
import { useState, useEffect, useRef } from "react";

export const usePublicFeed = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false); // 🔥 fix

  const loadingRef = useRef(false);

  const loadFeed = async () => {
    if (loadingRef.current || (!hasMore && cursor !== null)) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await getPublicFeed(30, cursor || undefined);

      const items = res.data.map((item: any) => ({
        type: item.type,
        data: item,
      }));

      setFeed((prev) => {
        const ids = new Set(
          prev.map((i: any) =>
            i.type === "report" ? i.data.reportingId : i.data.id,
          ),
        );

        const filtered = items.filter((i: any) => {
          const id = i.type === "report" ? i.data.reportingId : i.data.id;
          return !ids.has(id);
        });

        return [...prev, ...filtered];
      });

      // 🔥 gestion cursor clean
      setCursor(res.nextCursor || null);
      setHasMore(!!res.nextCursor);
    } catch (err) {
      console.error("❌ loadFeed error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return {
    feed,
    loadMore: loadFeed,
    loading,
    hasMore,
  };
};
