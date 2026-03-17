import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Suggestion } from "@src/types/Reports";
import InteractiveFeedbackCard from "../InteractiveFeedbackCard/InteractiveFeedbackCard";
import { getSuggestionById } from "@src/services/coupDeCoeurService";
import UsearlyDraw from "@src/components/background/Usearly";
import "./SuggestionDetail.scss";

const SuggestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Suggestion - Usearly 🚀";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await getSuggestionById(id);
        setSuggestion(data);
      } catch (err) {
        console.error("❌ Erreur fetchSuggestionById:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!suggestion) return <p>Suggestion introuvable</p>;

  return (
    <div className="suggestion-detail-page">
      <h2 className="page-title">Détail de la suggestion</h2>
      <div className="suggestion-card-wrapper">
        <InteractiveFeedbackCard
          key={suggestion.id}
          item={{ ...suggestion, type: "suggestion" }}
          isOpen={true}
          //onToggle={() => {}}
        />
      </div>
      <UsearlyDraw />
    </div>
  );
};

export default SuggestionDetail;
