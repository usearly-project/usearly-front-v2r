import type { ReactNode } from "react";
import "./SectionJoinUsearlyFeatureBox.scss";

type SectionJoinUsearlyFeatureBoxProps = {
  iconSrc: string;
  iconAlt?: string;
  title: string;
  description: ReactNode;
  emphasizeIcon?: boolean;
};

const SectionJoinUsearlyFeatureBox = ({
  iconSrc,
  iconAlt = "",
  title,
  description,
  emphasizeIcon = false,
}: SectionJoinUsearlyFeatureBoxProps) => {
  return (
    <div className="section-join-usearly-features-box">
      <div className="section-join-usearly-features-box-image-container">
        <img
          className={`section-join-usearly-features-box-image-container-image${
            emphasizeIcon
              ? " section-join-usearly-features-box-image-container-image--emphasized"
              : ""
          }`}
          src={iconSrc}
          alt={iconAlt}
        />
      </div>
      <div className="section-join-usearly-features-box-content-container">
        <h2>{title}</h2>
        {description}
      </div>
    </div>
  );
};

export default SectionJoinUsearlyFeatureBox;
