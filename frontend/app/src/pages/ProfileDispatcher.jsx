import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { api } from "../lib/axios";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useClientProfileStore } from "../store/clientProfileStore";
import VendorProfile from "./VendorProfile";
import ClientProfile from "./ClientProfile";
import { ClientProfileSkeleton } from "../components/skeletons/ClientProfileSkeleton";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function ProfileDispatcher() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const { authUser, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await checkAuth();
    navigate("/login");
  };

  useEffect(() => {
    const checkRole = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/v1/profile/${username}`);
        const data = res.data.data;

        console.log("Profile dispatcher data", data);

        if (data.vendorProfile) {
          setRole("vendor");
          useVendorProfileStore.setState({
            vendorProfile: data.vendorProfile,
            isGettingVendorProfile: false,
          });
        } else if (data.clientProfile) {
          setRole("client");
          useClientProfileStore.setState({
            clientProfile: data.clientProfile,
            loading: false,
          });
        } else {
          setError("Profile not found");
        }
      } catch (e) {
        console.error("Failed to fetch profile type:", e);
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      checkRole();
    }
  }, [username]);

  if (loading) return <ClientProfileSkeleton />;

  if (error) {
    const isCurrentUser =
      authUser &&
      (!username ||
        username === "undefined" ||
        username === "null" ||
        authUser.username === username ||
        authUser.username.toLowerCase() === username.toLowerCase());

    if (isCurrentUser) {
      return (
        <Navigate
          to={
            authUser.role === "vendor"
              ? "/create-vendor-profile"
              : "/create-client-profile"
          }
        />
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-primary-3 body-1">{error}</div>
        {authUser && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-n-3/20 rounded-xl text-xs font-bold uppercase tracking-wider text-n-5 hover:text-primary-3 hover:border-primary-3 transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        )}
      </div>
    );
  }

  if (role === "vendor") return <VendorProfile />;
  if (role === "client") return <ClientProfile />;

  return null;
}
