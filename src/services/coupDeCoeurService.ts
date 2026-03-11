import { apiService } from "./apiService";
import type { CoupDeCoeur } from "@src/types/Reports";

const getAuthToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

/**
 * 🔥 Récupérer les coups de cœur populaires
 */
export const getPopularCoupsDeCoeur = async (
  page = 1,
  limit = 10,
): Promise<{
  totalCoupsdeCoeur: number;
  currentPage: number;
  totalPages: number;
  coupdeCoeurs: CoupDeCoeur[];
}> => {
  const { data } = await apiService.get(`/coupdecoeurs/popular`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return data;
};

/**
 * 🔥 Récupérer les coups de cœur enflammés
 */
export const getEnflammesCoupsDeCoeur = async (
  page = 1,
  limit = 10,
): Promise<{
  totalCoupsdeCoeur: number;
  currentPage: number;
  totalPages: number;
  coupdeCoeurs: CoupDeCoeur[];
}> => {
  const { data } = await apiService.get(`/coupdecoeurs/enflammes`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return data;
};

/**
 * 🔥 Récupérer les coups de cœur publics (liste simple)
 */
/* export const getPublicCoupsDeCoeur = async (page = 1, limit = 10) => {
  const { data } = await apiService.get(`/public/user/coupsdecoeurs`, {
    params: { page, limit },
  });
  return data;
}; */

export const getCoupsDeCoeurByBrand = async (
  brand: string,
  page = 1,
  limit = 10,
) => {
  const { data } = await apiService.get(`/coupdecoeurs/by-brand`, {
    params: { brand, page, limit },
  });
  return data;
};

export const getSuggestionsByBrand = async (
  brand: string,
  page = 1,
  limit = 10,
) => {
  const { data } = await apiService.get(`/suggestions/by-brand`, {
    params: { brand, page, limit },
  });
  return data;
};

export const getAllBrands = async (): Promise<string[]> => {
  const res = await apiService.get("/brands");
  return res.data || [];
};

export const getAllBrandsSuggestion = async (): Promise<string[]> => {
  const res = await apiService.get("/brands-suggest");
  return res.data || [];
};

export const getSuggestionById = async (id: string) => {
  const { data } = await apiService.get(`/suggestions/${id}`);
  return data;
};

export const getCoupDeCoeurById = async (id: string): Promise<CoupDeCoeur> => {
  const res = await apiService.get(`/coupdecoeur/${id}`);
  return res.data;
};

export const getAllBrandsCdc = async () => {
  const res = await apiService.get("/coupdecoeurs/brands");
  return res.data.data;
};
