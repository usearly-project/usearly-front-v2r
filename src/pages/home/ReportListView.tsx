import ChronologicalReportList from "@src/components/report-grouped/ChronologicalReportList";
import ChronoReportCard from "@src/components/report-grouped/report-by-date/ChronoReportCard";
import HomeBrandBlock from "@src/components/home-grouped-reports-list/HomeBrandBlock";
import PopularReportCard from "@src/components/report-grouped/reports-popular/PopularReportCard";
import type {
  ExplodedGroupedReport,
  PopularGroupedReport,
  PublicGroupedReport,
} from "@src/types/Reports";
import FlatSubcategoryBlock from "./confirm-reportlist/FlatSubcategoryBlock";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import "./countBarBrand.scss";
import {
  matchesExplodedReportSearch,
  normalizeSearchText,
} from "@src/utils/reportSearch";
import "./ReportListView.scss";

interface Props {
  filter: string;
  viewMode: "flat" | "chrono" | "confirmed";

  flatData: Array<ExplodedGroupedReport | PublicGroupedReport>;
  chronoData: Record<string, any[]>;
  popularData: Record<string, PopularGroupedReport[]>;
  popularEngagementData: Record<string, PopularGroupedReport[]>;
  rageData: Record<string, PopularGroupedReport[]>;

  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;

  loadingChrono: boolean;
  loadingPopular: boolean;
  loadingPopularEngagement: boolean;
  loadingRage: boolean;

  hasMoreRage?: boolean;
  loadMoreRage?: () => void;
  loaderRef?: React.RefObject<HTMLDivElement | null>;

  searchTerm?: string;
  onClearSearchTerm?: () => void;
}

const ReportListView: React.FC<Props> = ({
  filter,
  viewMode,
  flatData,
  chronoData,
  popularData,
  popularEngagementData,
  rageData,
  expandedItems,
  handleToggle,
  loadingChrono,
  loadingPopular,
  loadingPopularEngagement,
  loadingRage,
  searchTerm,
  onClearSearchTerm,
}) => {
  const isPopularFilter = ["hot", "popular", "urgent"].includes(filter);

  const isChronoFilter = filter === "chrono";

  if (isPopularFilter) {
    const { groupedByDay, isLoading } =
      filter === "hot"
        ? { groupedByDay: popularData, isLoading: loadingPopular }
        : filter === "popular"
          ? {
              groupedByDay: popularEngagementData,
              isLoading: loadingPopularEngagement,
            }
          : filter === "rage"
            ? { groupedByDay: rageData, isLoading: loadingRage }
            : { groupedByDay: popularData, isLoading: loadingPopular };

    console.log("FILTER", filter);
    console.log("groupedByDay", groupedByDay);

    if (!isLoading && Object.keys(groupedByDay || {}).length === 0) {
      return (
        <div className="no-popular-results">
          <p>Aucune publication ne correspond à ce filtre pour le moment.</p>
        </div>
      );
    }

    return (
      <ChronologicalReportList
        groupedByDay={groupedByDay}
        renderCard={(item) => {
          // ✅ item: PopularGroupedReport
          const key = `${item.reportingId}-${item.subCategory}`;
          return (
            <PopularReportCard
              key={key}
              item={item}
              isOpen={!!expandedItems[key]}
              onToggle={() => handleToggle(key)}
              isHot={filter === "hot"}
            />
          );
        }}
      />
    );
  }

  if (viewMode === "chrono" && (filter === "" || isChronoFilter)) {
    if (!loadingChrono && Object.keys(chronoData || {}).length === 0) {
      return (
        <div className="no-popular-results">
          <p>Aucune publication récente disponible.</p>
        </div>
      );
    }

    return (
      <ChronologicalReportList
        groupedByDay={chronoData}
        renderCard={(item) => {
          const key = `${item.reportingId}-${item.subCategory.subCategory}`;
          return (
            <ChronoReportCard
              key={key}
              item={item}
              isOpen={!!expandedItems[key]}
              onToggle={() => handleToggle(key)}
            />
          );
        }}
      />
    );
  }

  // Flat view sans filtre
  if (viewMode === "confirmed" || filter === "rage") {
    const explodedReports = flatData.filter(
      (item): item is ExplodedGroupedReport =>
        "subCategory" in item &&
        typeof item.subCategory === "object" &&
        Array.isArray(item.subCategory.descriptions),
    );

    if (flatData.length === 0) {
      return (
        <SqueletonAnime
          loaderRef={{ current: null }}
          loading={true}
          hasMore={false}
          error={null}
        />
      );
    }

    if (explodedReports.length === 0) {
      return <p>Aucun report disponible pour ce filtre.</p>;
    }

    const normalizedSearchTerm = searchTerm
      ? normalizeSearchText(searchTerm)
      : "";

    const filteredExplodedReports = normalizedSearchTerm
      ? explodedReports.filter((item) =>
          matchesExplodedReportSearch(item, normalizedSearchTerm),
        )
      : explodedReports;

    if (filteredExplodedReports.length === 0) {
      return (
        <div className="no-search-results">
          <p>Aucun résultat pour "{searchTerm}"</p>
          <button
            type="button"
            onClick={onClearSearchTerm}
            className="clear-button"
          >
            Effacer
          </button>
        </div>
      );
    }

    return (
      <>
        {filteredExplodedReports.map((item) => (
          <FlatSubcategoryBlock
            key={`${item.reportingId}-${item.subCategory.subCategory}`}
            brand={item.marque}
            reportId={item.reportingId}
            subcategory={item.subCategory.subCategory}
            status={item.subCategory.status}
            descriptions={item.subCategory.descriptions}
            siteUrl={item.siteUrl || undefined}
            hasBrandResponse={item.hasBrandResponse}
            /* capture={item.capture || null} */
            hideFooter={true}
          />
        ))}
      </>
    );
  }

  const publicReportsOnly = flatData.filter(
    (report): report is PublicGroupedReport =>
      "subCategories" in report && Array.isArray(report.subCategories),
  );

  const grouped = publicReportsOnly.reduce<
    Record<string, PublicGroupedReport[]>
  >((acc, report) => {
    if (!acc[report.marque]) acc[report.marque] = [];
    acc[report.marque].push(report);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([brand, reports]) => (
        <HomeBrandBlock
          key={brand}
          brand={brand}
          siteUrl={reports[0]?.siteUrl || ""}
          reports={reports}
        />
      ))}
    </>
  );
};

export default ReportListView;
