import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import "./HomeGroupedReportsList.scss";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { useBrands } from "@src/hooks/useBrands";
import { getBrandLogo } from "@src/utils/brandLogos";
import BrandFilteredSection from "./sections/BrandFilteredSection";
import ConfirmedSection from "./sections/ConfirmedSection";
import RageSection from "./sections/RageSection";
import PopularSection from "./sections/PopularSection";
import ChronoSection from "./sections/ChronoSection";
import {
  useGroupedReportsLogic,
  normalizeText,
  getSearchableStrings,
} from "./hooks/useGroupedReportsLogic";
import { useLocation } from "react-router-dom";
import FilterBar from "../FilterBar";
import HotSection from "./sections/HotSection";
const FilterBarAny = FilterBar as unknown as React.ComponentType<any>;

interface Props {
  activeTab: FeedbackType;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  viewMode: "flat" | "chrono" | "confirmed";
  onViewModeChange: (mode: "flat" | "chrono" | "confirmed") => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedMainCategory: string;
  setSelectedMainCategory: (val: string) => void;
  setSelectedSiteUrl: (val: string | undefined) => void;
  selectedSiteUrl?: string;
  totalityCount: number;
  onSectionChange?: (section: string) => void;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
}

/**
 * 🧱 HomeGroupedReportsList
 * Liste principale des signalements groupés selon le filtre actif.
 * Gère les états globaux et délègue le rendu à des sous-sections spécialisées.
 */
const HomeGroupedReportsList: React.FC<Props> = ({
  activeTab,
  onViewModeChange,
  setActiveFilter,
  viewMode,
  selectedBrand,
  setSelectedBrand,
  setSelectedSiteUrl,
  selectedCategory,
  setSelectedCategory,
  selectedMainCategory,
  setSelectedMainCategory,
  selectedSiteUrl,
  totalityCount,
  onSectionChange,
  searchTerm: externalSearchTerm,
  onSearchTermChange,
}) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const location = useLocation();

  // === Logique partagée (useGroupedReportsLogic) ===
  const {
    filter,
    setFilter,
    reportData,
    chronoData,
    popularEngagementData,
    filteredReports,
    loadingFiltered,
    totalCount,
    initializing,
  } = useGroupedReportsLogic(
    activeTab,
    totalityCount,
    onSectionChange,
    selectedBrand,
    selectedCategory,
  );

  const { brands } = useBrands("report");
  const availableBrands = useMemo(
    () =>
      brands.map((b) => ({
        brand: b.marque,
        siteUrl: b.siteUrl,
      })),
    [brands],
  );

  const handleSearchTermChange = useCallback(
    (value: string) => {
      if (onSearchTermChange) {
        onSearchTermChange(value);
      } else {
        setLocalSearchTerm(value);
      }
    },
    [onSearchTermChange],
  );

  useEffect(() => {
    if (typeof externalSearchTerm === "string") {
      setLocalSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  useEffect(() => {
    handleSearchTermChange("");
  }, [selectedBrand, handleSearchTermChange]);

  const searchTermValue =
    typeof externalSearchTerm === "string"
      ? externalSearchTerm
      : localSearchTerm;

  const filteredByCategory = useMemo(() => {
    if (selectedCategory) {
      return filteredReports.filter((r) => r.subCategory === selectedCategory);
    }
    return filteredReports;
  }, [filteredReports, selectedCategory]);

  const normalizedSearchTerm = useMemo(
    () => (searchTermValue.trim() ? normalizeText(searchTermValue) : ""),
    [searchTermValue],
  );

  const reportsToDisplay = useMemo(() => {
    if (!normalizedSearchTerm) return filteredByCategory;
    return filteredByCategory.filter((r) => {
      const vals = getSearchableStrings(r);
      return vals.some((v) => normalizeText(v).includes(normalizedSearchTerm));
    });
  }, [filteredByCategory, normalizedSearchTerm]);

  useEffect(() => {
    if (!setSelectedSiteUrl) return;

    if (!selectedBrand && !selectedCategory) {
      setSelectedSiteUrl(undefined);
      return;
    }

    if (selectedBrand && selectedSiteUrl) return;

    const firstValid = reportsToDisplay.find(
      (r) => typeof r.siteUrl === "string" && r.siteUrl.trim().length > 0,
    );
    if (firstValid?.siteUrl) {
      setSelectedSiteUrl(firstValid.siteUrl);
      console.log("🔁 SiteUrl auto-déduit:", firstValid.siteUrl);
    }
  }, [
    selectedBrand,
    selectedCategory,
    selectedSiteUrl,
    reportsToDisplay,
    setSelectedSiteUrl,
  ]);

  // === Focus automatique depuis une notification ===
  useEffect(() => {
    const focusId = location.state?.focusDescriptionId;
    if (!focusId) return;
    const timeout = setTimeout(() => {
      const el = document.querySelector(`[data-description-id="${focusId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight-flash");
        setTimeout(() => el.classList.remove("highlight-flash"), 2500);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [location]);

  const availableSubCategories = useMemo(() => {
    if (!selectedBrand) return [];
    const subCategories = filteredReports
      .filter((report) => report.marque === selectedBrand)
      .map((report) => report.subCategory)
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    return Array.from(new Set(subCategories)).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" }),
    );
  }, [filteredReports, selectedBrand]);

  const availableSubCategoriesByBrandAndCategory = useMemo(() => {
    const grouped: Record<string, Record<string, string[]>> = {};

    (filteredReports ?? []).forEach((report) => {
      const brand = report.marque || "Autre";
      const category = Array.isArray(report.category)
        ? report.category[0]
        : report.category || "Autre catégorie";
      const sub = report.subCategory || "Autre sous-catégorie";

      if (!grouped[brand]) grouped[brand] = {};
      if (!grouped[brand][category]) grouped[brand][category] = [];

      if (!grouped[brand][category].includes(sub)) {
        grouped[brand][category].push(sub);
      }
    });

    return grouped;
  }, [filteredReports]);

  const isFeedLoading = Boolean(reportData?.loading || loadingFiltered);
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          console.log("👀 loader visible");

          if (
            reportData &&
            "loadMore" in reportData &&
            typeof reportData.loadMore === "function"
          ) {
            reportData.loadMore();
          }
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [reportData]);
  // === Initial loading ===
  if (initializing) {
    return (
      <div className="home-grouped-reports-list" data-current-section="loading">
        <SqueletonAnime
          loaderRef={loaderRef}
          loading
          hasMore={false}
          error={null}
        />
      </div>
    );
  }

  // === Render ===
  return (
    <div className="home-grouped-reports-list">
      <FilterBarAny
        filter={filter || ""}
        setFilter={setFilter}
        viewMode={viewMode}
        setViewMode={onViewModeChange}
        setSelectedBrand={setSelectedBrand}
        setSelectedCategory={setSelectedCategory}
        selectedMainCategory={selectedMainCategory}
        setSelectedMainCategory={setSelectedMainCategory}
        setActiveFilter={setActiveFilter}
        onViewModeChange={onViewModeChange}
        isHotFilterAvailable={true}
        dropdownRef={dropdownRef}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        availableBrands={availableBrands}
        setSelectedSiteUrl={setSelectedSiteUrl}
        siteUrl={selectedSiteUrl}
        availableCategories={availableSubCategories}
        availableSubCategoriesByBrandAndCategory={
          availableSubCategoriesByBrandAndCategory
        }
        isFeedLoading={isFeedLoading}
      />

      {selectedBrand || selectedCategory ? (
        <BrandFilteredSection
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSiteUrl={selectedSiteUrl}
          totalCount={totalCount}
          filteredByCategory={filteredByCategory}
          loadingFiltered={loadingFiltered}
          reportsToDisplay={reportsToDisplay}
          getBrandLogo={getBrandLogo}
          loaderRef={loaderRef}
        />
      ) : filter === "confirmed" ? (
        <ConfirmedSection
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSiteUrl={selectedSiteUrl}
          totalCount={totalCount}
          filteredByCategory={filteredByCategory}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
          searchTerm={searchTermValue}
          setSearchTerm={handleSearchTermChange}
          reportData={reportData}
          loaderRef={loaderRef}
        />
      ) : filter === "rage" ? (
        <RageSection
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSiteUrl={selectedSiteUrl}
          totalCount={totalCount}
          filteredByCategory={filteredByCategory}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
          searchTerm={searchTermValue}
          setSearchTerm={handleSearchTermChange}
          reportData={
            reportData as {
              data: any[];
              loading: boolean;
              hasMore: boolean;
              loadMore: () => void;
            }
          }
          loaderRef={loaderRef}
        />
      ) : filter === "popular" ? (
        <PopularSection
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSiteUrl={selectedSiteUrl}
          totalCount={totalCount}
          filteredByCategory={filteredByCategory}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
          reportData={reportData}
          popularEngagementData={popularEngagementData}
          loaderRef={loaderRef}
          searchTerm={searchTermValue}
          setSearchTerm={handleSearchTermChange}
        />
      ) : filter === "hot" ? (
        <HotSection
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          selectedSiteUrl={selectedSiteUrl}
          totalCount={totalCount}
          filteredByCategory={filteredByCategory}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
          searchTerm={searchTermValue}
          setSearchTerm={handleSearchTermChange}
          reportData={reportData}
          loaderRef={loaderRef}
        />
      ) : filter === "chrono" ? (
        <ChronoSection
          chronoData={chronoData}
          loaderRef={loaderRef}
          searchTerm={searchTermValue}
          onClearSearchTerm={() => handleSearchTermChange("")}
        />
      ) : (
        <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
          Aucun signalement à afficher pour ce filtre.
        </div>
      )}
    </div>
  );
};

export default HomeGroupedReportsList;
