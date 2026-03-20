import React from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import Avatar from "@src/components/shared/Avatar";
import { getBrandLogo } from "@src/utils/brandLogos";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import HotReportsList from "../hot/HotReportsList";

interface HotSectionProps {
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSiteUrl?: string;
  totalCount: number;
  filteredByCategory: any[];
  expandedItems: Record<string, boolean>;
  setExpandedItems: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  reportData: { data?: any; loading: boolean };
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 🔥 Section Hot
 * Représente le rendu du filtre "hot" (problèmes les plus signalés)
 */
const HotSection: React.FC<HotSectionProps> = ({
  selectedBrand,
  selectedCategory,
  selectedSiteUrl,
  totalCount,
  filteredByCategory,
  expandedItems,
  setExpandedItems,
  searchTerm,
  setSearchTerm,
  reportData,
  loaderRef,
}) => {
  // 🕓 Chargement
  if (reportData.loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  if (reportData.loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading
        hasMore={false}
        error={null}
      />
    );
  }

  if (!reportData.data || Object.keys(reportData.data).length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
        Aucun signalement chaud trouvé.
      </div>
    );
  }
  console.log("HOT DATA SOURCE", reportData.data);
  // ✅ Contenu principal
  return (
    <>
      {selectedBrand && (
        <div className="selected-brand-summary">
          <div className="selected-brand-summary__brand">
            <div className="selected-brand-summary__logo">
              <Avatar
                avatar={getBrandLogo(selectedBrand, selectedSiteUrl)}
                pseudo={selectedBrand}
                type="brand"
              />
            </div>
            <div className="selected-brand-summary__info-container">
              {selectedCategory ? (
                <>
                  <span className="count">{filteredByCategory.length}</span>
                  <span className="text">
                    Signalement
                    {filteredByCategory.length > 1 ? "s" : ""} lié
                    {filteredByCategory.length > 1 ? "s" : ""} à «{" "}
                    <b>{selectedCategory}</b> » sur{" "}
                    {` ${capitalizeFirstLetter(selectedBrand)}`}
                  </span>
                </>
              ) : (
                <>
                  <span className="count">{totalCount}</span>
                  <span className="text">
                    Signalement{totalCount > 1 ? "s" : ""} sur{" "}
                    {` ${capitalizeFirstLetter(selectedBrand)}`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <HotReportsList
        data={reportData.data}
        loading={reportData.loading}
        expandedItems={expandedItems}
        handleToggle={(key) =>
          setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        searchTerm={searchTerm}
        onClearSearchTerm={() => setSearchTerm("")}
      />
    </>
  );
};

export default HotSection;
