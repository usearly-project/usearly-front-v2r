import BrandResponseBanner from "@src/components/brand-response-banner/BrandResponseBanner";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";

interface Props {
  userProfile: any;
  descriptionId: string;
  showComments: boolean;
  setLocalCommentsCounts: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  brandResponse?: any;
}

const PopularReportComments: React.FC<Props> = ({
  userProfile,
  descriptionId,
  showComments,
  setLocalCommentsCounts,
  setRefreshKey,
  brandResponse,
}) => {
  if (!showComments || !userProfile?.id) return null;

  return (
    <>
      {brandResponse?.message && (
        <BrandResponseBanner
          message={brandResponse.message}
          createdAt={brandResponse.createdAt}
          brand={brandResponse.brand}
          brandSiteUrl={brandResponse.siteUrl}
          brandResponse={brandResponse}
        />
      )}

      <DescriptionCommentSection
        userId={userProfile.id}
        descriptionId={descriptionId}
        type="report"
        hideFooter={true}
        forceOpen={true}
        onCommentCountChange={(count) =>
          setLocalCommentsCounts((prev) => ({
            ...prev,
            [descriptionId]: count,
          }))
        }
        onCommentAddedOrDeleted={() => setRefreshKey((prev) => prev + 1)}
      />
    </>
  );
};

export default PopularReportComments;
