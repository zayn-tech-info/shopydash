import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LogOut, UserX, Home } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-n-3/10 flex items-center justify-center mb-6">
          <UserX className="w-10 h-10 text-n-5" strokeWidth={1.5} />
        </div>
        <h2 className="h4 font-bold text-n-7 mb-2">User Not Found</h2>
        <p className="body-2 text-n-5 max-w-xs mb-8">
          The user profile you are looking for is unavailable or does not exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-3 hover:bg-primary-2 rounded-xl text-n-1 font-bold transition-colors"
          >
            <Home size={18} />
            <span>Go Home</span>
          </Link>
          {authUser && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-2.5 border border-n-3/20 hover:border-n-3/40 rounded-xl text-n-7 font-bold transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (role === "vendor") return <VendorProfile />;
  if (role === "client") return <ClientProfile />;

  return null;
}
