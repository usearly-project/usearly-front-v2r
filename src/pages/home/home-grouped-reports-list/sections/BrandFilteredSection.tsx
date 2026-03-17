import React from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import FlatSubcategoryBlock from "../../confirm-reportlist/FlatSubcategoryBlock";
import { getMostAdvancedStatus } from "@src/utils/ticketStatus";
import type { TicketStatusKey } from "@src/types/ticketStatus";
import { useBrandResponsesMap } from "@src/hooks/useBrandResponsesMap";
import { normalizeBrandResponse } from "@src/utils/brandResponse";

interface BrandFilteredSectionProps {
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSiteUrl?: string;
  totalCount: number;
  filteredByCategory: any[];
  loadingFiltered: boolean;
  reportsToDisplay: any[];

  // ⚠️ conservée volontairement (utilisée ailleurs / contrat parent)
  getBrandLogo: (brand: string, siteUrl?: string) => string;

  loaderRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 🔑 Regroupement FRONT — Option A
 * 1 ticket logique par subCategory (aligné front marque)
 */
function groupReportsAsTickets(reports: any[]) {
  const map: Record<string, any> = {};

  for (const r of reports) {
    const sub = r.subCategory || "Autre";

    if (!map[sub]) {
      map[sub] = {
        subCategory: sub,
        brand: r.marque,
        siteUrl: r.siteUrl,
        capture: r.capture ?? null,

        pivotReportId: r.reportingId,
        reportIds: [r.reportingId],

        descriptions: Array.isArray(r.descriptions)
          ? [...r.descriptions]
          : r.description
            ? [r.description]
            : [],

        status: r.status as TicketStatusKey,
        count: 1,

        // 🔥 ICI
        solutionsCount: r.solutionsCount ?? 0,
      };
    } else {
      if (r.reportingId < map[sub].pivotReportId) {
        map[sub].pivotReportId = r.reportingId;
      }

      map[sub].reportIds.push(r.reportingId);
      map[sub].count += 1;

      if (Array.isArray(r.descriptions)) {
        map[sub].descriptions.push(...r.descriptions);
      } else if (r.description) {
        map[sub].descriptions.push(r.description);
      }

      map[sub].status = getMostAdvancedStatus(
        map[sub].status,
        r.status as TicketStatusKey,
      );

      // 🔥 ICI
      map[sub].solutionsCount =
        (map[sub].solutionsCount ?? 0) + (r.solutionsCount ?? 0);
    }
  }

  return Object.values(map);
}

/**
 * 🏷️ Section BrandFiltered
 * Vue TICKET (alignée avec le front marque)
 */
const BrandFilteredSection: React.FC<BrandFilteredSectionProps> = ({
  selectedBrand,
  selectedCategory,
  // selectedSiteUrl,
  filteredByCategory,
  loadingFiltered,
  reportsToDisplay,
  loaderRef,
}) => {
  const allReportIds = reportsToDisplay.map((r) => r.reportingId);
  const { brandResponsesMap } = useBrandResponsesMap(allReportIds);

  // 🕓 Chargement
  if (loadingFiltered) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  // ⚠️ Aucun résultat
  if (!reportsToDisplay.length) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement trouvé pour ces filtres...
      </div>
    );
  }

  // ✅ REGROUPEMENT OPTION A
  const ticketGroups = groupReportsAsTickets(reportsToDisplay);

  return (
    <div className="grouped-by-category">
      {selectedBrand && (
        <div className="selected-brand-summary">
          <div className="selected-brand-summary__brand">
            {/* <div className="selected-brand-summary__logo">
              <Avatar
                avatar={null}
                pseudo={selectedBrand}
                type="brand"
                siteUrl={selectedSiteUrl}
                preferBrandLogo={true}
              />
            </div> */}

            <div className="selected-brand-summary__info-container">
              {selectedCategory ? (
                <>
                  <span className="count">{filteredByCategory.length}</span>
                  <span className="text">
                    Signalement
                    {filteredByCategory.length > 1 ? "s" : ""} lié
                    {filteredByCategory.length > 1 ? "s" : ""} à «{" "}
                    <b>{selectedCategory}</b> » sur{" "}
                    {capitalizeFirstLetter(selectedBrand)}
                  </span>
                </>
              ) : (
                <>
                  <span className="count">{ticketGroups.length}</span>
                  <span className="text">
                    Signalement{ticketGroups.length > 1 ? "s" : ""} sur{" "}
                    {capitalizeFirstLetter(selectedBrand)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ✅ 1 CARTE = 1 TICKET LOGIQUE */}
      {ticketGroups.map((ticket) => {
        const rawBrandResponse = ticket.reportIds
          .map((id: string) => brandResponsesMap[id])
          .find(Boolean);
        const hasBrandResponse = normalizeBrandResponse(rawBrandResponse, {
          brand: ticket.brand,
          siteUrl: ticket.siteUrl ?? null,
        });

        return (
          <FlatSubcategoryBlock
            key={ticket.pivotReportId}
            reportIds={ticket.reportIds}
            brand={ticket.brand}
            siteUrl={ticket.siteUrl}
            subcategory={ticket.subCategory}
            descriptions={ticket.descriptions}
            capture={ticket.capture}
            status={ticket.status}
            hideFooter={true}
            hasBrandResponse={hasBrandResponse}
            solutionsCount={ticket.solutionsCount}
          />
        );
      })}
    </div>
  );
};

export default BrandFilteredSection;
