import React, { useEffect, useState } from "react";
import { api } from "../lib/axios";
import ProfileHeader from "../components/Profile/ProfileHeader";
import AboutWishlist from "../components/Profile/AboutWishlist";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useClientProfileStore } from "../store/clientProfileStore";
import { Edit } from "lucide-react";

export function ClientProfile() {
  const authUser = useAuthStore((state) => state.authUser);
  const loading = useClientProfileStore((state) => state.loading);
  const error = useClientProfileStore((state) => state.error);
  const clientProfile = useClientProfileStore((state) => state.clientProfile);
  const getClientProfile = useClientProfileStore(
    (state) => state.getClientProfile
  );

  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientProfile = async () => {
      await getClientProfile();
    };
    fetchClientProfile();
  }, [getClientProfile]);

  useEffect(() => {
    console.log(clientProfile);
  }, [clientProfile]);

  if (loading) return <div className="p-8">Loading profile…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ProfileHeader
            getClientProfile={getClientProfile}
            clientProfile={clientProfile}
          />
        </div>

        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-md border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-n-9">
                  {clientProfile?.fullName}
                </h1>
                <p className="text-sm text-n-6">
                  @{clientProfile?.username || "-"} •{" "}
                  {[
                    clientProfile?.city,
                    clientProfile?.state,
                    clientProfile?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {authUser &&
                clientProfile &&
                authUser._id === clientProfile.userId ? (
                  <button
                    className="h-10 px-4 bg-n-1 text-n-9 border-n-3 border rounded-md text-sm inline-flex items-center justify-center"
                    title="Logout"
                  >
                    <Edit />
                  </button>
                ) : null}
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
            <AboutWishlist clientProfile={clientProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
