import { apiService } from "./apiService";
import type {
  BrandWithSubCategories,
  CoupDeCoeur,
  GetConfirmedResponse,
  GroupedReport,
  Suggestion,
  UserGroupedReportResponse,
  UserStatsSummary,
} from "@src/types/Reports";

export const getGlobalFeedbackStats = async () => {
  const response = await apiService.get("/user/stats/global-feedback");
  return response.data;
};

export const getWeeklyGlobalFeedbackStats = async () => {
  const response = await apiService.get("/user/stats/global-weekly");
  return response.data;
};
/**
 * Coups de cœur de l'utilisateur
 */
export const getUserCoupsDeCoeur = async (
  page = 1,
  limit = 10,
): Promise<{
  totalCoupsdeCoeur: number;
  currentPage: number;
  totalPages: number;
  coupdeCoeurs: CoupDeCoeur[];
}> => {
  const { data } = await apiService.get(`/user/coupsdecoeur`, {
    params: { page, limit },
    /* headers: {
      Authorization: `Bearer ${token}`,
    }, */
  });

  return data;
};

/**
 * Suggestions de l'utilisateur
 */
export const getUserSuggestions = async (
  page = 1,
  limit = 10,
): Promise<{
  totalSuggestions: number;
  currentPage: number;
  totalPages: number;
  suggestions: Suggestion[];
}> => {
  const { data } = await apiService.get(`/user/suggestions`, {
    params: { page, limit },
  });

  return data;
};

export const getUserProfileGroupedReports = async (
  page = 1,
  limit = 10,
): Promise<UserGroupedReportResponse> => {
  try {
    const { data } = await apiService.get<UserGroupedReportResponse>(
      `/reportings/grouped-by-category?page=${page}&limit=${limit}`,
    );

    console.log("data from back view brand: ", data);
    return data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      "Erreur lors du chargement des signalements groupés (profil).";
    throw new Error(msg);
  }
};

// Signalements de l'utilisateur
export const getUserReports = async (userId: string) => {
  const response = await apiService.get(`/user/reports?userId=${userId}`);
  return response.data.reports as GroupedReport[];
};

export const getUserStatsSummary = async (): Promise<UserStatsSummary> => {
  const res = await apiService.get("/user/stats-summary");
  return res.data;
};

export const getAllPublicGroupedReports = async (page = 1, limit = 10) => {
  try {
    const response = await apiService.get(
      `/reportings/public-grouped-by-category`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur lors du chargement des signalements publics groupés :",
      error,
    );
    throw error;
  }
};

export const getPublicCoupsDeCoeur = async (page: number, limit: number) => {
  const res = await apiService.get(
    `/public/user/coupsdecoeurs?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getPublicSuggestions = async (page: number, limit: number) => {
  const res = await apiService.get(
    `/public/user/suggestions?page=${page}&limit=${limit}`,
  );
  return res.data;
};
export const getFilteredReportDescriptions = async (
  brand: string,
  category: string,
  page = 1,
  limit = 10,
) => {
  const response = await apiService.get("/descriptions/filtery", {
    params: { brand, category, page, limit },
  });
  return response.data;
};

export const getGroupedReportsByDate = async (page = 1, limit = 15) => {
  const response = await apiService.get("/reportings/public-grouped-by-date", {
    params: { page, limit },
  });
  return response.data;
};

export const getUserReportsGroupedByDate = async (
  page: number,
  limit: number,
) => {
  const res = await apiService.get(
    `/user/grouped-by-date?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getGroupedReportsByHot = async (
  page = 1,
  limit = 15,
  filter?: string,
) => {
  const response = await apiService.get("/reportings/grouped-by-hot", {
    params: { page, limit, filter },
  });

  return response.data;
};

export const getGroupedReportsByPopularEngagement = async (
  page = 1,
  limit = 15,
) => {
  const response = await apiService.get(
    "/reportings/grouped-by-popular-engagement",
    {
      params: { page, limit },
    },
  );

  return response.data;
};

export const getPopularReports = async (page = 1, limit = 15): Promise<any> => {
  const response = await apiService.get<any>(
    "/reportings/grouped-by-popular-engagement",
    {
      params: { page, limit },
    },
  );

  return response.data;
};

export const getConfirmedSubcategoryReports = async (
  page = 1,
  limit = 15,
): Promise<GetConfirmedResponse> => {
  const response = await apiService.get<GetConfirmedResponse>(
    "/public/confirmed-subcategories",
    {
      params: { page, limit },
    },
  );

  return response.data;
};

export const getRageReports = async (
  page = 1,
  limit = 5,
): Promise<GetConfirmedResponse> => {
  const response = await apiService.get<GetConfirmedResponse>(
    "/public/rage-reports",
    {
      params: { page, limit, debug: 1 },
    },
  );

  return response.data;
};

export const getAllBrands = async (): Promise<BrandWithSubCategories[]> => {
  const res = await apiService.get("/reportings/brands");
  return res.data.data || [];
};

export const toggleCommentLike = async (commentId: string) => {
  return apiService.post(`/comments/${commentId}/like`);
};

export const getCommentLikesCount = async (commentId: string) => {
  return apiService.get(`/comments/${commentId}/likes-count`);
};

export const fetchComments = async (type: string, parentId: string) => {
  return apiService.get(`/comments/${type}/${parentId}`);
};

export const getPublicFeed = async (limit = 30, cursor?: string) => {
  const params: any = { limit };

  if (cursor) {
    params.cursor = cursor;
  }

  const response = await apiService.get("/public/reports", { params });

  return response.data;
};

export const getWeeklyImpact = async () => {
  const response = await apiService.get("/user/stats/weekly-impact");
  return response.data;
};

export const getTrendingBrands = async () => {
  const res = await apiService.get("/brands/trending");
  return res.data;
};

export const getRightSidebarStats = async () => {
  const res = await apiService.get("/reports/stats/right-sidebar");
  return res.data;
};

export const voteSolution = async (solutionId: string, value: number) => {
  const res = await apiService.post("/user/reporting-solutions/vote", {
    solutionId,
    value,
  });
  return res.data;
};

export const createSolution = async (data: {
  reportId: string;
  message: string;
}) => {
  const res = await apiService.post("/user/reporting-solutions", data);
  return res.data;
};

export const getSolutionsByReport = async (reportId: string) => {
  const response = await apiService.get(
    `/reporting-solutions/report/${reportId}`,
  );

  return response.data;
};
