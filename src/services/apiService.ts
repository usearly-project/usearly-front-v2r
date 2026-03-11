import axios from "axios";
import type { RegisterData } from "@src/types/RegisterData";
import { refreshToken } from "./refreshToken";
import { getAccessToken, storeTokenInCurrentStorage } from "./tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_VERSION = import.meta.env.VITE_API_VERSION || "api";

export const apiService = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export interface RegisterResponse {
  userId?: string; // optionnel car si compte expiré, on ne renvoie pas toujours un ID
  email?: string; // pareil : parfois c'est juste un message
  message?: string;
  code?: string;

  requiresConfirmation?: boolean; // ⚠️ compte déjà créé mais non confirmé
  expired?: boolean; // ⚠️ compte supprimé car délai dépassé
  success?: boolean; // homogénéité avec login
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id?: string;
    email?: string;
    pseudo?: string;
    avatar?: string;
    type?: string;
  };

  requiresConfirmation?: boolean; // ⚠️ compte pas confirmé
  expired?: boolean; // ⚠️ compte supprimé car délai dépassé
}

export const loginUser = async ({
  email,
  pseudo,
  password,
  rememberMe,
}: {
  email?: string;
  pseudo?: string;
  password: string;
  rememberMe: boolean;
}): Promise<LoginResponse> => {
  try {
    const { data } = await apiService.post<LoginResponse>("/user/login", {
      email,
      pseudo,
      password,
      rememberMe,
    });

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const data = error.response.data as LoginResponse;

      // ✅ Cas spéciaux renvoyés par le back
      if (data.requiresConfirmation || data.expired) {
        return data;
      }

      throw new Error(
        data.message || "Erreur lors de la connexion utilisateur.",
      );
    }

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Erreur inconnue lors de la connexion utilisateur.");
  }
};

export const loginBrand = async ({
  email,
  mdp,
  rememberMe,
}: {
  email: string;
  mdp: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await apiService.post("/brand/login", {
      email,
      mdp,
      rememberMe,
    });

    return response.data; // contient accessToken + user { avatar, type: 'brand' }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Erreur lors de la connexion marque.";
    throw new Error(msg);
  }
};

export const registerUser = async (
  data: RegisterData,
): Promise<RegisterResponse> => {
  try {
    const { data: response } = await apiService.post<RegisterResponse>(
      "/user/register",
      data,
    );
    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const resp = error.response?.data;

      // 🟢 Cas spécial : confirmation requise
      if (resp?.code === "CONFIRMATION_REQUIRED") {
        return resp as RegisterResponse; // on retourne normalement
      }

      if (resp?.requiresConfirmation || resp?.expired) {
        return resp as RegisterResponse;
      }

      // ❌ autres erreurs → on propage
      throw {
        code: resp?.code || "UNKNOWN",
        message:
          resp?.message ||
          resp?.error ||
          "Erreur inconnue lors de l’inscription.",
      };
    }

    if (error instanceof Error) {
      throw { code: "JS_ERROR", message: error.message };
    }

    throw {
      code: "UNKNOWN",
      message: "Erreur inconnue lors de l’inscription....",
    };
  }
};

// 🟢 Intercepteur de requête → ajoute le accessToken actif
apiService.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// 🟣 Intercepteur de réponse → gère les 401 (token expiré)
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest?.url?.includes("/user/login") ||
      originalRequest?.url?.includes("/user/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newAccessToken = await refreshToken();

          if (!newAccessToken) {
            throw new Error("Refresh token failed");
          }

          storeTokenInCurrentStorage(newAccessToken);

          apiService.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;

          onRefreshed(newAccessToken);

          isRefreshing = false;

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return apiService(originalRequest);
        } catch (err) {
          isRefreshing = false;
          console.error("❌ refresh token échoué :", err);

          window.location.href = "/";

          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(apiService(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);
/* apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest?.url?.includes("/user/login") ||
      originalRequest?.url?.includes("/user/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      console.log("🔄 Token expiré, tentative de refresh...");

      try {
        const newAccessToken = await refreshToken();

        if (newAccessToken) {
          storeTokenInCurrentStorage(newAccessToken);

          apiService.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          console.log("✅ Token rafraîchi, requête rejouée.");
          return apiService(originalRequest);
        }
      } catch (err) {
        console.error("❌ Échec du refresh token :", err);
      }
    }

    return Promise.reject(error);
  },
); */

export const confirmEmailRequest = async (
  data: { token: string } | { otp: string; email: string },
) => {
  const response = await apiService.post("/user/confirm", data);
  return response.data;
};

export const resendConfirmationCode = async (email: string) => {
  const response = await apiService.post("/user/resend-confirmation", {
    email,
  });
  return response.data;
};
export const requestResetPassword = async (email: string) => {
  const res = await apiService.post("/user/request-reset", { email });
  return res.data;
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const res = await apiService.post("/user/reset-password", {
    token,
    newPassword,
    confirmPassword,
  });

  return res.data;
};

export const updateUserProfile = async (formData: FormData) => {
  try {
    const response = await apiService.patch("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.user;
  } catch (error: any) {
    const msg =
      error.response?.data?.error || "Erreur lors de la mise à jour du profil.";
    throw new Error(msg);
  }
};

export const updatePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await apiService.put("/user/update-password", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.error ||
      "Erreur lors de la mise à jour du mot de passe.";
    throw new Error(msg);
  }
};

export const logoutUser = async () => {
  try {
    await apiService.post("/user/logout");
  } catch (error) {
    console.error("Erreur lors du logout côté serveur", error);
  }
};

export const deleteUserProfile = async () => {
  try {
    const response = await apiService.delete("/user/profile");
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.error || "Erreur lors de la suppression du compte.";
    throw new Error(msg);
  }
};

export const checkMailExists = async (
  email: string,
): Promise<{ exists: boolean }> => {
  try {
    const response = await apiService.post("/check-email", { email });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email :", error);
    throw new Error("Erreur lors de la vérification de l'email.");
  }
};
