import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearAccessToken, getAccessToken, getCurrentUser } from "../services/auth";

type AuthStatus = "checking" | "authenticated" | "anonymous";

export default function ProtectedRoute() {
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus>(() => getAccessToken() ? "checking" : "anonymous");

  useEffect(() => {
    let active = true;
    if (!getAccessToken()) {
      setStatus("anonymous");
      return () => { active = false; };
    }

    setStatus("checking");
    getCurrentUser()
      .then(() => { if (active) setStatus("authenticated"); })
      .catch(() => {
        clearAccessToken();
        if (active) setStatus("anonymous");
      });

    return () => { active = false; };
  }, []);

  if (status === "checking") {
    return <main role="status" aria-live="polite" style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#64748b" }}>Checking your session…</main>;
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
