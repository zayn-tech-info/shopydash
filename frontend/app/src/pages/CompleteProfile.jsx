import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    if (authUser.role === "vendor") {
      navigate("/create-vendor-profile");
    } else {
      navigate("/create-client-profile");
    }
  }, [authUser, navigate]);

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center">
      <div className="text-center">
        <p className="text-n-4">Redirecting to profile creation...</p>
      </div>
    </div>
  );
}
