import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { authUser } = useAuthStore();

  useEffect(() => {
    const checkRole = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/v1/profile/${username}`);
        const data = res.data.data;

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
    if (authUser && (authUser.username === username || !username)) {
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-primary-3 body-1">{error}</div>
      </div>
    );
  }

  if (role === "vendor") return <VendorProfile />;
  if (role === "client") return <ClientProfile />;

  return null;
}
