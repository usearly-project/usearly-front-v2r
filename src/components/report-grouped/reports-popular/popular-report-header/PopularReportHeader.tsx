import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "@src/components/shared/Avatar";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";

interface Props {
  item: any;
  isOpen: boolean;
  author: any;
  brandLogo: string;
  formattedShortDate: string;
  firstDescription: any;
}

const PopularReportHeader: React.FC<Props> = ({
  item,
  isOpen,
  author,
  brandLogo,
  formattedShortDate,
  firstDescription,
}) => {
  return (
    <div className="subcategory-header">
      <div className="subcategory-left">
        <img
          src={getCategoryIconPathFromSubcategory(item.subCategory)}
          alt={item.subCategory}
          className="subcategory-icon"
        />
        <div className="subcategory-text">
          <div className="subcategory-title-row">
            <h4>{item.subCategory || "Signalement"}</h4>
            {formattedShortDate && (
              <span className="date-badge">• {formattedShortDate}</span>
            )}
          </div>
        </div>
      </div>

      <div className="subcategory-right">
        {isOpen ? (
          <div className="expanded-header">
            <div className="avatar-logo-group">
              <Avatar
                avatar={author.avatar}
                pseudo={author.pseudo}
                type="user"
              />
              <Avatar avatar={brandLogo} pseudo={item.marque} type="brand" />
            </div>
            <UserBrandLine
              userId={author.id}
              email={author?.email}
              pseudo={author.pseudo}
              brand={item.marque}
              type="report"
            />
          </div>
        ) : (
          <div className="collapsed-header">
            <span className="date-subcategory">
              {formatDistanceToNow(new Date(firstDescription.createdAt), {
                locale: fr,
                addSuffix: true,
              }).replace("environ ", "")}
            </span>
            <Avatar avatar={brandLogo} pseudo={item.marque} type="brand" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularReportHeader;
