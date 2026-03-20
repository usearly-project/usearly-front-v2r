import { getWeeklyImpact } from "@src/services/feedbackService";
import { useState, useEffect } from "react";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import "./HeroBanner.scss";

const HeroBanner = () => {
  const [stats, setStats] = useState({
    reports: 0,
    coupsDeCoeur: 0,
    suggestions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWeeklyImpact();
        setStats(data);
      } catch (error) {
        console.error("Erreur récupération stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="hero-banner">
      <div className="hero-content">
        <div className="hero-left">
          <h1>
            <span className="highlight">Ensemble</span> on fait
            <br />
            bouger les marques !
          </h1>
        </div>

        <div className="hero-right">
          <p className="hero-impact">
            L'impact de la communauté cette semaine :
          </p>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">
                {loading ? "..." : stats.reports}
              </span>
              <img src={reportYellowIcon} alt="reports" />
            </div>

            <div className="stat">
              <span className="stat-value">
                {loading ? "..." : stats.coupsDeCoeur}
              </span>
              <img src={likeRedIcon} alt="likes" />
            </div>

            <div className="stat">
              <span className="stat-value">
                {loading ? "..." : stats.suggestions}
              </span>
              <img src={suggestGreenIcon} alt="suggestions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
