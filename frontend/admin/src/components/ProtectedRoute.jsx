import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { CircularProgress } from "@mui/material";

export default function ProtectedRoute() {
  const { admin, initializing, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <CircularProgress />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
