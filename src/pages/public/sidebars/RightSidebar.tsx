import { useEffect, useState } from "react";
import "./RightSidebar.scss";
import { getRightSidebarStats } from "@src/services/feedbackService";
import { pluralize } from "@src/utils/plurilize";

type Stats = {
  totalReports: number;
  totalTickets: number;
};

const RightSidebar = () => {
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    totalTickets: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getRightSidebarStats();
        setStats(data);
      } catch (e) {
        console.error("Erreur stats sidebar:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="right-sidebar">
      <h3>Ça chauffe par ici ! 🔥</h3>

      <p className="subtitle">
        Les sujets qui font réagir la communauté en ce moment.
      </p>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="stats">
          <div className="stat-item">
            <span className="arrow">→</span>
            <span className="value">{stats.totalReports}</span>
            <span className="label">
              {pluralize(stats.totalReports, "signalement", "signalements")}{" "}
              <br />
              dans les dernières 48h
            </span>
          </div>

          <div className="stat-item">
            <span className="arrow">→</span>
            <span className="value">{stats.totalTickets}</span>
            <span className="label">
              {pluralize(stats.totalTickets, "problème", "problèmes")} <br />
              très signalés en ce moment
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
