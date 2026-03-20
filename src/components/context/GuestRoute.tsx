import { Navigate } from "react-router-dom";
import { useAuth } from "@src/services/AuthContext";
import type { JSX } from "react";

interface GuestRouteProps {
  children: JSX.Element;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { isAuthenticated, userProfile } = useAuth();

  // 🔁 En cours de chargement (profil pas encore prêt)
  if (isAuthenticated && !userProfile) {
    return <div>Chargement…</div>;
  }

  // 🔐 Rediriger les utilisateurs connectés
  if (isAuthenticated && userProfile) {
    const redirectPath =
      userProfile.type === "brand" ? "/dashboard-brand" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // 👤 Utilisateur non connecté → autorisé
  return children;
};

export default GuestRoute;
