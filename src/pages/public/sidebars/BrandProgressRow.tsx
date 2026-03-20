import Avatar from "@src/components/shared/Avatar";
import { getBrandLogo } from "@src/utils/brandLogos";
import "./BrandProgressRow.scss";

type Props = {
  name: string;
  siteUrl: string;
  progress: number;
  label: string;
  count: number;
  isTop?: boolean;
  onHover: (e: React.MouseEvent, text: string) => void;
  onLeave: () => void;
};

const BrandProgressRow = ({
  name,
  siteUrl,
  progress,
  count,
  label,
  isTop,
  onHover,
  onLeave,
}: Props) => {
  return (
    <div className={`brand-row ${isTop ? "top" : ""}`}>
      <div className="brand-row-top">
        <Avatar
          avatar={getBrandLogo(name, siteUrl)}
          pseudo={name}
          type="brand"
        />

        <div className="brand-info">
          <span className="brand-label">{label}</span>
        </div>

        <span
          className="progress-score"
          onMouseEnter={(e) => onHover(e, `${name} — ${count} signalements`)}
          onMouseLeave={onLeave}
        >
          <strong>{count}</strong>/100
        </span>
      </div>

      <div className="brand-progress">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandProgressRow;
