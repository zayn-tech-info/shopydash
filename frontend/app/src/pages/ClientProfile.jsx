import { useEffect, useState } from "react";
import ProfileHeader from "../components/client/ProfileHeader";
import AboutAndWishlist from "../components/client/AboutAndWishlist";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { useClientProfileStore } from "../store/clientProfileStore";
import { EditClientProfile } from "../components/client/EditClientProfile";
import { LogOut } from "lucide-react";
import { ClientAddress } from "../components/client/ClientAddress";
import { ClientProfileSkeleton } from "../components/skeletons/ClientProfileSkeleton";

export function ClientProfile() {
  const authUser = useAuthStore((state) => state.authUser);
  const loading = useClientProfileStore((state) => state.loading);
  const error = useClientProfileStore((state) => state.error);
  const clientProfile = useClientProfileStore((state) => state.clientProfile);
  const getProfile = useClientProfileStore((state) => state.getProfile);
  const clientProfileData = useClientProfileStore(
    (state) => state.clientProfileData
  );
  const setClientProfileData = useClientProfileStore(
    (s) => s.setClientProfileData
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const params = useParams();

  const openEdit = () => {
    if (clientProfile) {
      setClientProfileData(clientProfile);
    }
    setShowEditModal(true);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const usernameToFetch = params?.username || authUser?.username;

        if (
          clientProfile &&
          clientProfile?.userId?.username === usernameToFetch
        ) {
          return;
        }

        if (usernameToFetch) {
          await getProfile(usernameToFetch);
        }
      } catch (err) {
        console.error("Failed to load client profile:", err);
      }
    };
    fetchProfile();
  }, [getProfile, params?.username, authUser?.username, clientProfile]);

  useEffect(() => {
    console.log(clientProfile);
  }, [clientProfile]);

  if (loading) return <ClientProfileSkeleton />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-primary-3 body-1">{error}</div>
      </div>
    );

  return (
    <main className="py-12 bg-n-1 min-h-[80vh]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <ProfileHeader
                clientProfile={clientProfile}
                authUser={authUser}
                openEdit={openEdit}
              />
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="h3 text-n-8 mb-2">
                    {clientProfile?.userId?.fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-n-4 body-2">
                    <span className="font-code text-primary-3">
                      @{clientProfile?.userId?.username || "-"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-n-3"></span>
                    <span>
                      {[
                        clientProfile?.city,
                        clientProfile?.state,
                        clientProfile?.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm min-h-[400px]">
              <AboutAndWishlist clientProfile={clientProfile} />
            </div>

            {/* Contact Info Section */}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm">
              <ClientAddress
                authUser={authUser}
                clientProfile={clientProfile}
              />
            </div>

            {/* Logout Button */}
            {authUser &&
              clientProfile &&
              authUser._id === clientProfile.userId?._id && (
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-n-1 border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 rounded-2xl transition-all font-code text-sm font-bold uppercase tracking-wider shadow-sm"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
          </div>
        </div>
      </div>

      {showEditModal && clientProfileData ? (
        <EditClientProfile
          clientProfileData={clientProfileData}
          onClose={() => setShowEditModal(false)}
        />
      ) : null}
    </main>
  );
}

export default ClientProfile;
