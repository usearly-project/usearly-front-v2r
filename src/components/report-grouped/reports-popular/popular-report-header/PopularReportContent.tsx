import React from "react";

interface Props {
  descriptionText: string;
  showFullText: boolean;
  setShowFullText: React.Dispatch<React.SetStateAction<boolean>>;
  captureUrl: string | null;
  descriptionLength: number;
  previewLength: number;
  setShowCapturePreview: (v: boolean) => void;
}

const PopularReportContent: React.FC<Props> = ({
  descriptionText,
  showFullText,
  setShowFullText,
  captureUrl,
  descriptionLength,
  previewLength,
  setShowCapturePreview,
}) => {
  const shouldShowToggle = descriptionLength > previewLength || !!captureUrl;

  return (
    <div className="main-description">
      <div className="description-text">
        <span className="description-content">{descriptionText}</span>

        {showFullText && captureUrl && (
          <div className="inline-capture">
            <img
              src={captureUrl}
              alt="Capture du problème"
              onClick={(e) => {
                e.stopPropagation();
                setShowCapturePreview(true);
              }}
            />
          </div>
        )}

        {shouldShowToggle && (
          <div className={`see-more-section ${showFullText ? "expanded" : ""}`}>
            {showFullText && <br />}

            <button
              className={`see-more-button ${showFullText ? "expanded" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowFullText((prev) => !prev);
              }}
            >
              {showFullText ? "Voir moins" : "Voir plus"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularReportContent;
