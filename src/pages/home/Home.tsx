import { useState, useCallback, useMemo, useEffect } from "react";
import "./Home.scss";
import { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import PurpleBanner from "./components/purpleBanner/PurpleBanner";
import { useFeedbackData } from "./hooks/useFeedbackData";
import { useBrandColors } from "./hooks/useBrandColors";
import { useCategories } from "./hooks/useCategories";
import { useIsAtBottom } from "@src/hooks/detect-bottom";
import ReportTab from "./home-tabs/ReportTab";
import CdcTabEnhanced from "./home-tabs/CdcTabEnhanced";
import SuggestionTabEnhanced from "./home-tabs/SuggestionTabEnhanced";
import LeftSidebar from "../public/sidebars/LeftSidebar";
import { useNavigate, useSearchParams } from "react-router-dom";

const FEEDBACK_LIST_WRAPPER_SELECTOR = ".feedback-list-wrapper";
const BOTTOM_THRESHOLD_PX = 12;
const getDefaultFilters = () => ({
  selectedBrand: "",
  selectedCategory: "",
  selectedMainCategory: "",
  activeFilter: "chrono",
  suggestionSearch: "",
  selectedSiteUrl: undefined as string | undefined,
});

const isScrollableElement = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element);
  const overflowY = styles.overflowY;
  const canScrollY =
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return canScrollY && element.scrollHeight > element.clientHeight + 1;
};

const getFeedbackScrollableAncestors = () => {
  if (typeof window === "undefined") return [] as HTMLElement[];

  const feedbackList = document.querySelector<HTMLElement>(
    FEEDBACK_LIST_WRAPPER_SELECTOR,
  );
  if (!feedbackList) return [] as HTMLElement[];

  const ancestors: HTMLElement[] = [];
  let current: HTMLElement | null = feedbackList;

  while (current) {
    if (isScrollableElement(current)) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }

  return ancestors;
};

function Home() {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("chrono");
  const [suggestionSearch, setSuggestionSearch] = useState("");
  const [selectedSiteUrl, setSelectedSiteUrl] = useState<string | undefined>();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as FeedbackType | null;
  const navigate = useNavigate();
  const validTabs: FeedbackType[] = ["report", "coupdecoeur", "suggestion"];
  const safeTab: FeedbackType =
    tabFromUrl && validTabs.includes(tabFromUrl as FeedbackType)
      ? (tabFromUrl as FeedbackType)
      : "report";

  const isAtBottom = useIsAtBottom({
    thresholdPx: BOTTOM_THRESHOLD_PX,
    anchorSelector: FEEDBACK_LIST_WRAPPER_SELECTOR,
  });

  useEffect(() => {
    document.body.classList.add("feedback-route");
    document.documentElement.classList.add("feedback-route");

    return () => {
      document.body.classList.remove("feedback-route");
      document.documentElement.classList.remove("feedback-route");
    };
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");

    const hasOnlyValidParam =
      searchParams.has("tab") && validTabs.includes(tab as FeedbackType);

    if (!hasOnlyValidParam) {
      navigate("/feedback?tab=report", { replace: true });
    }
  }, [searchParams]);

  useEffect(() => {
    if (safeTab !== activeTab) {
      const defaults = getDefaultFilters();

      setSelectedBrand(defaults.selectedBrand);
      setSelectedCategory(defaults.selectedCategory);
      setSelectedMainCategory(defaults.selectedMainCategory);
      setSuggestionSearch(defaults.suggestionSearch);
      setSelectedSiteUrl(defaults.selectedSiteUrl);

      // ✅ important
      if (safeTab === "report") {
        setActiveFilter("chrono");
      } else if (safeTab === "coupdecoeur") {
        setActiveFilter("chrono");
      } else if (safeTab === "suggestion") {
        setActiveFilter("allSuggest");
      }

      setActiveTab(safeTab);
    }
  }, [safeTab]);
  const handleTabChange = useCallback(
    (nextTab: FeedbackType) => {
      if (nextTab === activeTab) return;

      const defaults = getDefaultFilters();
      setSelectedBrand(defaults.selectedBrand);
      setSelectedCategory(defaults.selectedCategory);
      setSelectedMainCategory(defaults.selectedMainCategory);
      setActiveFilter(defaults.activeFilter);
      setSuggestionSearch(defaults.suggestionSearch);
      setSelectedSiteUrl(defaults.selectedSiteUrl);
      setActiveTab(nextTab);
    },
    [activeTab],
  );

  const scrollToTop = useCallback(() => {
    if (typeof window === "undefined") return;

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });

    const scrollableAncestors = getFeedbackScrollableAncestors();
    scrollableAncestors.forEach((ancestor) => {
      ancestor.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  // ✅ Gestion de la marque
  const handleSetBrand = useCallback((brand: string, siteUrl?: string) => {
    setSelectedBrand(brand);
    setSelectedSiteUrl(siteUrl);
  }, []);

  // ✅ Appel du hook au niveau du composant (conforme aux règles React)
  const {
    feedbackData,
    isLoading,
    isInitialLoading,
    displayedCount,
    suggestionsForDisplay,
    coupDeCoeursForDisplay,
    hasMore,
    loadMore,
  } = useFeedbackData(
    activeTab,
    activeFilter,
    selectedBrand,
    selectedCategory,
    suggestionSearch,
  );

  const { brandBannerStyle, suggestionBannerStyle } = useBrandColors(
    activeTab,
    selectedBrand,
    feedbackData,
    selectedSiteUrl,
  );

  const { suggestionCategories, coupDeCoeurCategories } = useCategories(
    activeTab,
    feedbackData,
    selectedBrand,
  );

  const handleSuggestionBrandChange = useCallback(
    (brand: string, siteUrl?: string) => {
      handleSetBrand(brand, siteUrl);
      setSelectedCategory("");
      setSelectedMainCategory("");
      setSuggestionSearch("");
      setActiveFilter(brand ? "brandSolo" : "allSuggest");
    },
    [handleSetBrand],
  );

  const totalCount = displayedCount;

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) return [];
    if (activeTab === "coupdecoeur") return coupDeCoeursForDisplay;
    if (activeTab === "suggestion") return suggestionsForDisplay;
    return [];
  }, [
    activeTab,
    selectedCategory,
    coupDeCoeursForDisplay,
    suggestionsForDisplay,
  ]);
  console.log("ACTIVE TAB:", activeTab);
  return (
    <div className="home-page">
      <PurpleBanner activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="user-main-content">
        <aside className="left-panel">
          <LeftSidebar />
        </aside>

        {activeTab === "report" && (
          <ReportTab
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={handleSetBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedMainCategory={selectedMainCategory}
            setSelectedMainCategory={setSelectedMainCategory}
            setSelectedSiteUrl={setSelectedSiteUrl}
            brandBannerStyle={brandBannerStyle}
            selectedSiteUrl={selectedSiteUrl}
            displayedCount={displayedCount}
          />
        )}

        {activeTab === "coupdecoeur" && (
          <CdcTabEnhanced
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={handleSetBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            brandBannerStyle={brandBannerStyle}
            coupDeCoeurCategories={coupDeCoeurCategories}
            coupDeCoeursForDisplay={coupDeCoeursForDisplay}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={selectedSiteUrl}
            setSelectedSiteUrl={setSelectedSiteUrl}
            isLoading={isLoading}
            isInitialLoading={isInitialLoading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        )}

        {activeTab === "suggestion" && (
          <SuggestionTabEnhanced
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBrand={selectedBrand}
            handleSuggestionBrandChange={handleSuggestionBrandChange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            suggestionCategories={suggestionCategories}
            suggestionSearch={suggestionSearch}
            setSuggestionSearch={setSuggestionSearch}
            suggestionBannerStyle={suggestionBannerStyle}
            brandBannerStyle={brandBannerStyle}
            suggestionsForDisplay={suggestionsForDisplay}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={selectedSiteUrl}
            isLoading={isLoading}
          />
        )}
      </main>

      {isAtBottom && (
        <button
          type="button"
          className="feedback-scroll-top-fab is-visible"
          onClick={scrollToTop}
          aria-label="Remonter en haut"
          title="Remonter en haut"
        >
          ↑
        </button>
      )}
    </div>
  );
}

export default Home;
