import CloseButton from "@src/components/buttons/CloseButtons";

interface Props {
  captureUrl: string | null;
  onClose: () => void;
}

const PopularReportLightbox: React.FC<Props> = ({ captureUrl, onClose }) => {
  if (!captureUrl) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <CloseButton stateSetter={onClose} stateValue={false} />
        <img src={captureUrl} alt="Aperçu capture" />
      </div>
    </div>
  );
};

export default PopularReportLightbox;
