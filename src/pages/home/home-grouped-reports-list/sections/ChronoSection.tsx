import React, { useMemo } from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import FlatSubcategoryBlock from "../../confirm-reportlist/FlatSubcategoryBlock";
import {
  matchesExplodedReportSearch,
  normalizeSearchText,
} from "@src/utils/reportSearch";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import { formatFullDate } from "@src/utils/dateUtils";
import { CalendarDays } from "lucide-react";
import "./ChronoSection.scss";

interface ChronoSectionProps {
  chronoData: { data?: any[]; loading: boolean };
  loaderRef: React.RefObject<HTMLDivElement | null>;
  searchTerm: string;
  onClearSearchTerm?: () => void;
}

/**
 * 🗓️ Section Chrono
 * Affiche les signalements récents (filtre "chrono")
 * - Gère le chargement
 * - Gère le cas vide
 * - Affiche les signalements avec date
 */
const ChronoSection: React.FC<ChronoSectionProps> = ({
  chronoData,
  loaderRef,
  searchTerm,
  onClearSearchTerm,
}) => {
  const normalizedSearchTerm = searchTerm
    ? normalizeSearchText(searchTerm)
    : "";

  const filteredReports = useMemo(() => {
    const source = (chronoData.data ?? []) as ExplodedGroupedReport[];
    if (!normalizedSearchTerm) return source;
    return source.filter((report) =>
      matchesExplodedReportSearch(report, normalizedSearchTerm),
    );
  }, [chronoData.data, normalizedSearchTerm]);

  const groupedByDate = useMemo(() => {
    if (!filteredReports.length) {
      return [];
    }

    const groups = new Map<string, any[]>();

    filteredReports.forEach((report: ExplodedGroupedReport) => {
      const key = report.date ?? "unknown";
      const existing = groups.get(key);

      if (existing) {
        existing.push(report);
      } else {
        groups.set(key, [report]);
      }
    });

    return Array.from(groups.entries());
  }, [filteredReports]);

  // 🕓 Chargement
  if (chronoData.loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  if (!chronoData.data || chronoData.data.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement récent disponible.
      </div>
    );
  }

  if (filteredReports.length === 0 && normalizedSearchTerm) {
    return (
      <div className="no-search-results">
        <p>Aucun résultat pour "{searchTerm}"</p>
        {onClearSearchTerm && (
          <button
            type="button"
            onClick={onClearSearchTerm}
            className="clear-button"
          >
            Effacer
          </button>
        )}
      </div>
    );
  }
  console.log("CHRONO DATA 👉", chronoData.data);
  // ✅ Contenu principal
  return (
    <div className="recent-reports-list">
      {groupedByDate.map(([dateKey, reports]) => {
        const formattedDate = (() => {
          if (!dateKey || dateKey === "unknown") {
            return "Date inconnue";
          }

          const parsedDate = new Date(dateKey);

          if (Number.isNaN(parsedDate.getTime())) {
            return "Date inconnue";
          }

          return formatFullDate(parsedDate);
        })();

        return (
          <div key={dateKey} className="date-group">
            <div className="date-header">
              <CalendarDays size={18} className="calendar-icon" />
              <h3 className="date-title">{formattedDate}</h3>
            </div>

            <div className="recent-report-items">
              {reports.map((report: any, index: number) => (
                <FlatSubcategoryBlock
                  key={`${report.reportingId}-${index}`}
                  brand={report.marque}
                  reportId={report.reportingId}
                  siteUrl={report.siteUrl || undefined}
                  hasBrandResponse={report.hasBrandResponse}
                  subcategory={report.subCategory.subCategory}
                  status={report.status}
                  descriptions={report.subCategory.descriptions || []}
                  capture={report.capture || null}
                  solutionsCount={report.solutionsCount ?? 0}
                  hideFooter={true}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChronoSection;
