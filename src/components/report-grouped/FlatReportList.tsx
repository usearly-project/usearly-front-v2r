import React, { useMemo, type JSX } from "react";
import type { GroupedReport } from "@src/types/Reports";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./FlatReportList.scss";
import { ChevronDown } from "lucide-react";
import { Virtuoso } from "react-virtuoso";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import {
  FALLBACK_BRAND_PLACEHOLDER,
  normalizeDomain,
} from "@src/utils/brandLogos";

interface Props {
  grouped: [string, GroupedReport[]][];
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  renderCard: (item: any, index: number) => JSX.Element;
}

const getLatestDateLabel = (reports: GroupedReport[]) => {
  const allDates = reports
    .flatMap(
      (r) =>
        r.subCategories?.flatMap(
          (sub) => sub.descriptions?.map((d) => d.createdAt) || [],
        ) || [],
    )
    .filter(Boolean)
    .map((date) => parseISO(date as string));

  if (allDates.length === 0) return null;
  const latest = allDates.reduce((a, b) => (a > b ? a : b));
  return formatDistanceToNow(latest, { locale: fr, addSuffix: true });
};

const FlatReportList = ({
  grouped,
  groupOpen,
  setGroupOpen,
  renderCard,
}: Props): JSX.Element => {
  // 🧩 Récupère toutes les marques + siteUrl associés
  const brandEntries = useMemo(() => {
    return grouped.map(([brand, reports]) => ({
      brand,
      siteUrl: reports?.[0]?.siteUrl || undefined,
    }));
  }, [grouped]);

  // ⚡ Charge automatiquement les logos
  const logos = useBrandLogos(brandEntries);

  const handleToggle = (brand: string) => {
    setGroupOpen((prev) => {
      const isCurrentlyOpen = prev[brand];
      const newState: Record<string, boolean> = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = false;
      });
      newState[brand] = !isCurrentlyOpen;
      return newState;
    });
  };

  return (
    <>
      {grouped.map(([brand, reports]) => {
        const isOpen = groupOpen[brand];
        const total = reports.length;
        const latestDate = getLatestDateLabel(reports);

        // 🔑 On crée la clé normalisée (brand|domain)
        const rawUrl = reports?.[0]?.siteUrl ?? "";
        const domain = rawUrl ? normalizeDomain(rawUrl) : "";

        const key = `${brand.toLowerCase()}|${domain}`;
        const logoUrl = logos[key] || FALLBACK_BRAND_PLACEHOLDER;

        return (
          <div key={brand} className="report-group">
            <div
              className={`report-group-header ${isOpen ? "open" : ""}`}
              onClick={() => handleToggle(brand)}
            >
              <div className="report-main-info">
                <img className="brand-logo-small" src={logoUrl} alt={brand} />
                <span className="report-count-number">{total}</span>
                <span className="report-label">
                  signalement{total > 1 ? "s" : ""} sur <strong>{brand}</strong>
                </span>
                {latestDate && (
                  <span className="report-date">• {latestDate}</span>
                )}
              </div>
              {isOpen ? (
                <div className="svg-info">
                  <ChevronDown size={20} className="report-extra-info" />
                </div>
              ) : (
                <div className="report-extra-info">
                  {latestDate && (
                    <span className="report-date">{latestDate}</span>
                  )}
                  <img className="brand-logo" src={logoUrl} alt={brand} />
                </div>
              )}
            </div>

            {isOpen && (
              <div className="report-list">
                <Virtuoso
                  style={{ height: 600 }}
                  totalCount={reports.length}
                  itemContent={(index) => renderCard(reports[index], index)}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default FlatReportList;
