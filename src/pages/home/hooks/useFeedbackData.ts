import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import {
  getCoupsDeCoeurByBrand,
  getSuggestionsByBrand,
} from "@src/services/coupDeCoeurService";
import { fetchFeedbackData } from "@src/services/feedbackFetcher";

// 🔹 Extraction sécurisée du label
const getSubCategoryLabel = (item: CoupDeCoeur | Suggestion): string => {
  const raw =
    (item as any).subCategory ??
    (item as any).subcategory ??
    (item as any).category ??
    (item as any).categorie ??
    (item as any).categoryName ??
    (item as any)["category_name"] ??
    "";
  return typeof raw === "string" ? raw.trim() : "";
};

const normalizeText = (value: string) =>
  value
    ? value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
    : "";

// ✅ Version corrigée du hook
export function useFeedbackData(
  activeTab: FeedbackType,
  activeFilter: string,
  selectedBrand: string,
  selectedCategory: string,
  suggestionSearch: string,
  initialPage = 1,
  limit = 20,
) {
  const [feedbackData, setFeedbackData] = useState<
    (CoupDeCoeur | Suggestion)[]
  >([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const isFetchingRef = useRef(false);

  const prevTab = useRef<FeedbackType | null>(null);
  const prevBrand = useRef<string | null>(null);
  const prevFilter = useRef<string | null>(null);

  /**
   * 📥 Fonction de récupération de page
   */
  const fetchPage = useCallback(
    async (currentPage: number, reset = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setIsLoading(true);

      console.log(`🔹 fetchPage(${currentPage}) lancé`);

      try {
        let result: any;

        const normalizedBrand = selectedBrand?.toLowerCase().trim();
        const hasBrand =
          normalizedBrand &&
          normalizedBrand !== "tous" &&
          normalizedBrand !== "all";

        if (activeTab === "coupdecoeur" && hasBrand) {
          // 🔥 Filtrage par marque pour CDC
          result = await getCoupsDeCoeurByBrand(
            selectedBrand,
            currentPage,
            limit,
          );
        } else if (activeTab === "suggestion" && hasBrand) {
          // 🔥 Filtrage par marque pour Suggestion
          result = await getSuggestionsByBrand(
            selectedBrand,
            currentPage,
            limit,
          );
        } else {
          // 🔥 Cas normal — all brands, filtres : popular, enflammés, récents, etc.
          result = await fetchFeedbackData(
            activeFilter,
            activeTab,
            currentPage,
            limit,
          );
        }

        let data =
          result?.data || result?.coupdeCoeurs || result?.suggestions || [];

        data = data.map((item: any) => ({
          ...item,
          type:
            item.type ??
            (activeTab === "coupdecoeur"
              ? "coupdecoeur"
              : activeTab === "suggestion"
                ? "suggestion"
                : "report"),
        }));

        console.log(
          `✅ Page ${currentPage} récupérée (${data.length} éléments)`,
        );

        if (reset) {
          setFeedbackData(data);
        } else {
          // 🧩 Ajoute les nouvelles données sans perdre les anciennes
          setFeedbackData((prev) => [...prev, ...data]);
        }

        setHasMore(result?.hasMore ?? data.length >= limit);
      } catch (err) {
        console.error("❌ Erreur fetchPage:", err);
        setHasMore(false);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsInitialLoading(false);
      }
    },
    [activeTab, activeFilter, selectedBrand, limit],
  );

  /**
   * 🧭 Gestion du reset intelligent
   */
  useEffect(() => {
    const tabChanged = prevTab.current !== activeTab;
    const filterChanged =
      prevFilter.current !== activeFilter ||
      prevBrand.current !== selectedBrand;

    if (tabChanged) {
      console.log("🧹 Reset total (changement d'onglet)");

      isFetchingRef.current = false; // 🔥 IMPORTANT

      setFeedbackData([]);
      setPage(1);
      setHasMore(true);
      setIsInitialLoading(true);

      fetchPage(1, true);
    } else if (filterChanged) {
      console.log("♻️ Rafraîchissement (filtre ou marque)");

      isFetchingRef.current = false; // 🔥 IMPORTANT

      setFeedbackData([]);
      setPage(1);
      setHasMore(true);
      setIsInitialLoading(false);

      fetchPage(1, true);
    }

    prevTab.current = activeTab;
    prevFilter.current = activeFilter;
    prevBrand.current = selectedBrand;
  }, [activeTab, activeFilter, selectedBrand]);

  /**
   * ⬇️ Scroll infini
   */
  const loadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMore) return;
    const nextPage = page + 1;
    console.log(`⬇️ Scroll détecté, chargement page ${nextPage}`);
    setPage(nextPage);
    fetchPage(nextPage, false);
  }, [hasMore, page, fetchPage]);

  /**
   * 🎯 Filtrage suggestions
   */
  const suggestionsForDisplay = useMemo(() => {
    if (activeTab !== "suggestion") return feedbackData;
    const query = normalizeText(suggestionSearch);
    return feedbackData.filter((item) => {
      const haystacks = [
        (item as any).title,
        (item as any).description,
        (item as any).marque,
        getSubCategoryLabel(item),
      ];
      return haystacks.some((t) => normalizeText(t ?? "").includes(query));
    });
  }, [activeTab, feedbackData, suggestionSearch]);

  /**
   * 🎯 Filtrage coups de cœur
   */
  const coupDeCoeursForDisplay = useMemo(() => {
    if (activeTab !== "coupdecoeur") return feedbackData;
    if (!selectedCategory) return feedbackData;
    return feedbackData.filter(
      (i) => getSubCategoryLabel(i) === selectedCategory,
    );
  }, [activeTab, feedbackData, selectedCategory]);

  const displayedCount = useMemo(() => {
    if (activeTab === "suggestion") return suggestionsForDisplay.length;
    if (activeTab === "coupdecoeur") return coupDeCoeursForDisplay.length;
    return feedbackData.length;
  }, [activeTab, suggestionsForDisplay, coupDeCoeursForDisplay, feedbackData]);

  return {
    feedbackData,
    isLoading,
    isInitialLoading,
    hasMore,
    loadMore,
    displayedCount,
    suggestionsForDisplay,
    coupDeCoeursForDisplay,
  };
}
