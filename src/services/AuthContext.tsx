import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService, logoutUser } from "@src/services/apiService";
import { refreshToken } from "@src/services/refreshToken";
import {
  getAccessToken,
  isTokenExpired,
  storeTokenInCurrentStorage,
} from "@src/services/tokenStorage";

export interface UserProfile {
  id?: string;
  avatar: string;
  type: "user" | "brand";
  role?: "user" | "admin" | "super_admin";
  pseudo?: string;
  email?: string;
  born?: string;
  gender?: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  login: (
    accessToken: string,
    profile: UserProfile,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const login = async (
    accessToken: string,
    profile: UserProfile,
    rememberMe = false,
  ) => {
    apiService.defaults.headers.common["Authorization"] =
      `Bearer ${accessToken}`;

    // ✅ stocker userType dans le même storage que le token
    if (rememberMe) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userType", profile.type);
    } else {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("userType", profile.type);
    }

    try {
      const res = await apiService.get("/user/me");

      const fullProfile: UserProfile = {
        ...res.data,
        type: "user",
        role: res.data.role,
      };

      setUserProfile(fullProfile);
      setIsAuthenticated(true);

      // 🔐 sécurité : la session est maintenant restaurée
      setIsLoading(false);

      if (fullProfile.type === "user") {
        navigate("/");
      } else {
        navigate("/dashboard-brand");
      }
    } catch (err) {
      console.error("❌ Erreur récupération profil après login", err);
    }
  };

  const logout = () => {
    logoutUser();

    setIsAuthenticated(false);
    setUserProfile(null);

    delete apiService.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userType");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userType");
    setIsLoading(false);
    navigate("/");
  };

  const fetchUserProfile = async () => {
    try {
      const res = await apiService.get("/user/me");

      setUserProfile({
        ...res.data,
        type: "user",
        role: res.data.role,
      });
    } catch (err) {
      console.error("Erreur profil", err);
      throw err;
    }
  };

  useEffect(() => {
    const tryRestoreSession = async () => {
      try {
        const storedUserType =
          localStorage.getItem("userType") ||
          sessionStorage.getItem("userType");

        const accessToken = getAccessToken();

        if (!storedUserType && !accessToken) {
          setIsLoading(false);
          return;
        }

        let token = accessToken;

        if (!token || isTokenExpired(token)) {
          try {
            token = await refreshToken();

            if (!token) {
              logout();
              return;
            }

            storeTokenInCurrentStorage(token);
          } catch (error) {
            console.error("❌ refresh token échoué :", error);
            logout();
            return;
          }
        }

        const res = await apiService.get("/user/me");

        const profile: UserProfile = {
          ...res.data,
          type: "user",
          role: res.data.role,
        };

        setUserProfile(profile);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("❌ restauration session échouée :", err);

        const hadToken = !!getAccessToken();

        if (hadToken) {
          logout(); // ✅ vrai cas invalide
        } else {
          // ✅ utilisateur public → pas de redirect
          setIsAuthenticated(false);
          setUserProfile(null);
        }
      } finally {
        // 🔥 toujours arrêter le loading
        setIsLoading(false);
      }
    };

    tryRestoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userProfile,
        login,
        logout,
        setUserProfile,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
