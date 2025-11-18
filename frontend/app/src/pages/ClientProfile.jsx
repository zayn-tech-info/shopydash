import { useEffect, useState } from "react";
import ProfileHeader from "../components/client/ProfileHeader";
import AboutWishlist from "../components/client/AboutWishlist";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useClientProfileStore } from "../store/clientProfileStore";
import { Edit } from "lucide-react";
import { EditClientProfile } from "../components/client/EditClientProfile";

export function ClientProfile() {
  const authUser = useAuthStore((state) => state.authUser);
  const loading = useClientProfileStore((state) => state.loading);
  const error = useClientProfileStore((state) => state.error);
  const clientProfile = useClientProfileStore((state) => state.clientProfile);
  const getClientProfile = useClientProfileStore(
    (state) => state.getClientProfile
  );
  const clientProfileData = useClientProfileStore(
    (state) => state.clientProfileData
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const openEdit = () => {
    setShowEditModal(true);
  };
  
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
    <main className="py-10 bg-gray-50 min-h-[70vh]">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <ProfileHeader
              getClientProfile={getClientProfile}
              clientProfile={clientProfile}
            />
          </div>

          <div className="md:col-span-3 space-y-6">
            <div>
              <section className="bg-white rounded-lg p-6 border border-gray-100">
                <AboutWishlist clientProfile={clientProfile} />
              </section>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-n-9">
                    {clientProfile?.fullName}
                  </h1>
                  <p className="text-sm text-n-6 mt-1">
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
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm bg-white"
                      title="Edit profile"
                      onClick={openEdit}
                    >
                      <Edit />
                      <span>Edit</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="px-4 py-2 bg-primary-3 text-white rounded-md text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
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
