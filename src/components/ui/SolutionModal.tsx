import { useState } from "react";
import Modal from "@src/components/ui/Modal";
import "./SolutionModal.scss";
import { createSolution } from "@src/services/feedbackService";
import toast from "react-hot-toast";

interface Props {
  reportId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const SolutionModal: React.FC<Props> = ({ reportId, onClose, onSuccess }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Veuillez écrire une solution.");
      return;
    }

    try {
      setLoading(true);

      await createSolution({
        reportId,
        message,
      });

      // ✅ SUCCESS TOAST
      toast.success("Solution partagée avec succès 🙌");

      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);

      const errorMessage =
        err?.response?.data?.error || "Une erreur est survenue.";

      // 🎯 CAS SPÉCIAL
      if (errorMessage.includes("already submitted")) {
        toast("Tu as déjà proposé une solution pour ce problème 👍", {
          icon: "💡",
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="solution-modal">
        <div className="header-modal">
          <span className="icon">💡</span>
          <h2>Partager une solution</h2>
        </div>

        <p>
          Vous avez trouvé une <strong>solution de contournement</strong> ou une
          <strong> astuce</strong> pour ce problème ?
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Décrivez comment contourner ou résoudre ce problème..."
        />

        <div className="actions">
          <button
            className="solution-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </button>

          <button
            className="solution-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Envoi..." : "Partager la solution"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SolutionModal;
