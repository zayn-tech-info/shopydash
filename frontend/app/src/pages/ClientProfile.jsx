import React, { useEffect, useState } from "react";
import { api } from "../lib/axios";
import ProfileHeader from "../components/Profile/ProfileHeader";
import AboutWishlist from "../components/Profile/AboutWishlist";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export function ClientProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/v1/clientProfile/getClientProfile");
        const payload = res?.data?.data?.clientProfile || null;
        if (mounted) setProfile(payload);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Failed to load"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-8">Loading profile…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ProfileHeader profile={profile} />
        </div>

        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-md border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-n-9">
                  {profile?.fullName}
                </h1>
                <p className="text-sm text-n-6">
                  @{profile?.username || "-"} •{" "}
                  {[profile?.city, profile?.state, profile?.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="h-10 px-4 bg-primary-3 text-white rounded-md text-sm inline-flex items-center justify-center"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <AboutWishlist profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
