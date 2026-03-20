import { useEffect, useState } from "react";
import BrandProgressRow from "./BrandProgressRow";
import "./LeftSidebar.scss";
import { getTrendingBrands } from "@src/services/feedbackService";

type Brand = {
  brandName: string;
  siteUrl: string;
  count: number;
  progress: number;
  message: string;
};
const LeftSidebar = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const displayedBrands = showAll ? brands.slice(0, 10) : brands.slice(0, 3);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getTrendingBrands();
        setBrands(data);
      } catch (e) {
        console.error("Erreur trending brands:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleSeeAll = (e: React.MouseEvent) => {
    if (brands.length <= 3) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

      const padding = 12;
      const tooltipWidth = 220;

      let x = rect.left + rect.width / 2;

      if (x + tooltipWidth / 2 > window.innerWidth) {
        x = window.innerWidth - tooltipWidth / 2 - padding;
      }

      if (x - tooltipWidth / 2 < padding) {
        x = tooltipWidth / 2 + padding;
      }

      setTooltip({
        visible: true,
        x,
        y: rect.top - 8,
        text: "Aucune autre marque ne nécessite d’action pour le moment",
      });

      setTimeout(() => {
        setTooltip((prev) => ({ ...prev, visible: false }));
      }, 2500);
    } else {
      setShowAll((prev) => !prev);
    }
  };
  return (
    <div className="left-sidebar">
      <h3>Les marques à faire réagir en ce moment !</h3>

      <div className="brands-list">
        {loading ? (
          <p>Chargement...</p>
        ) : brands.length === 0 ? (
          <p className="empty">Aucune marque à faire réagir pour le moment</p>
        ) : (
          displayedBrands.map((brand, index) => (
            <BrandProgressRow
              key={brand.siteUrl}
              name={brand.brandName}
              siteUrl={brand.siteUrl}
              progress={brand.progress}
              label={brand.message}
              count={brand.count}
              isTop={index === 0}
              onHover={(e, text) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const padding = 12;
                const tooltipWidth = 180; // estimation safe
                let x = rect.left + rect.width / 2;
                // 🔥 clamp à droite
                if (x + tooltipWidth > window.innerWidth) {
                  x = window.innerWidth - tooltipWidth - padding;
                }
                // 🔥 clamp à gauche
                if (x < padding) {
                  x = padding;
                }
                setTooltip({
                  visible: true,
                  x,
                  y: rect.top - 10,
                  text,
                });
              }}
              onLeave={() => {
                setTimeout(() => {
                  setTooltip((prev) => ({ ...prev, visible: false }));
                }, 50);
              }}
            />
          ))
        )}
      </div>

      <div className="see-all-wrapper">
        <button className="see-all" onClick={handleSeeAll}>
          {showAll ? "Voir moins" : "Voir toutes les marques"}
        </button>
      </div>
      <p className="sidebar-text">
        Ces marques crispent beaucoup d’utilisateurs en ce moment.Ajoute ton
        signalement et faisons bouger les choses ensemble.
      </p>
      {tooltip.visible && (
        <div
          className="global-tooltip"
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            transform: "translate(-50%, -120%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
