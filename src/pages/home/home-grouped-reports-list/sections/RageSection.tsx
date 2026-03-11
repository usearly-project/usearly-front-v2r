import React from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import Avatar from "@src/components/shared/Avatar";
import { getBrandLogo } from "@src/utils/brandLogos";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import RageReportsList from "../../rage/RageReportsList";

interface RageSectionProps {
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
  reportData: {
    data: any[];
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
  };
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 🔥 Section Rage
 * Représente le rendu du filtre "rage" (signalements rageux)
 * - Affiche le résumé de la marque sélectionnée
 * - Rend la liste RageReportsList
 * - Gère le chargement et les cas vides
 */
const RageSection: React.FC<RageSectionProps> = ({
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
  /*   if (reportData.loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  } */

  // ⚠️ Aucun signalement rageux
  if (!reportData.data || reportData.data.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement rageux trouvé.
      </div>
    );
  }

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

      <RageReportsList
        data={reportData.data}
        loading={reportData.loading}
        hasMore={reportData.hasMore}
        loadMore={reportData.loadMore}
        loaderRef={loaderRef}
        expandedItems={expandedItems}
        handleToggle={(key: string) =>
          setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        searchTerm={searchTerm}
        onClearSearchTerm={() => setSearchTerm("")}
      />

      {/* 👇 LE LOADER DOIT ETRE ICI */}
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={reportData.loading}
        hasMore={reportData.hasMore}
        error={null}
      />
    </>
  );
};

export default RageSection;
