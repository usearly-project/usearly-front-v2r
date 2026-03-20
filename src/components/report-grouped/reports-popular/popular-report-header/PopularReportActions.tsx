import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";

interface Props {
  userProfile: any;
  descriptionId: string;
  item: any;
  hasBrandResponse: any;
  currentCount: number;
  handleCommentClick: () => void;
  handleToggleSimilarReports: () => void;
  isPublic: boolean;
  onOpenSolutionModal: () => void;
  solutionsCount?: number;
}

const PopularReportActions: React.FC<Props> = ({
  userProfile,
  descriptionId,
  item,
  hasBrandResponse,
  currentCount,
  handleCommentClick,
  handleToggleSimilarReports,
  onOpenSolutionModal,
  solutionsCount,
  isPublic,
}) => {
  return (
    <ReportActionsBarWithReactions
      userId={userProfile?.id}
      descriptionId={descriptionId}
      reportsCount={item.count}
      status={item.status}
      type="report"
      descriptions={item.descriptions.map((d: any) => ({
        author: d.author,
      }))}
      solutionsCount={solutionsCount}
      hasBrandResponse={hasBrandResponse}
      commentsCount={currentCount}
      onReactClick={() => {
        if (isPublic) return;
      }}
      onOpenSolutionModal={onOpenSolutionModal}
      onCommentClick={handleCommentClick}
      onToggleSimilarReports={handleToggleSimilarReports}
    />
  );
};

export default PopularReportActions;
