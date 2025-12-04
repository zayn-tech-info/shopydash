import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Edit, Link2, LogOut, Plus } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { EditVendorProfile } from "../components/vendor/EditVendorProfile";
import VendorSidebar from "../components/vendor/VendorSidebar";
import AboutAndProducts from "../components/vendor/AboutAndProducts";
import { VendorAddress } from "../components/vendor/VendorAddress";
import { VendorProfileSkeleton } from "../components/skeletons/VendorProfileSkeleton";

const normaliseDate = (date) => {
  try {
    return new Date(date).toLocaleDateString();
  } catch (e) {
    return "--";
  }
};

export default function VendorProfile() {
  const isGettingVendorProfile = useVendorProfileStore(
    (state) => state.isGettingVendorProfile
  );

  const vendorProfile = useVendorProfileStore((state) => state.vendorProfile);
  const getProfile = useVendorProfileStore((state) => state.getProfile);

  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const navigate = useNavigate();

  const params = useParams();
  const location = useLocation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const fileInputRef = useRef(null);

  const isOwner = authUser?._id === vendorProfile?.userId?._id;
  const displayProfileImage = isOwner
    ? authUser?.profilePic || vendorProfile?.userId?.profilePic || Logo
    : vendorProfile?.userId?.profilePic || Logo;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await updateProfile(formData);
      toast.success("Profile picture updated successfully");
      if (authUser.username) {
        await getProfile(authUser.username);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const usernameToFetch = params?.username || authUser?.username;
        if (
          vendorProfile &&
          (vendorProfile?.userId?.username === usernameToFetch ||
            vendorProfile?.storeUsername === usernameToFetch)
        ) {
          return;
        }

        if (usernameToFetch) {
          await getProfile(usernameToFetch);
        }
      } catch (err) {
        console.error("Failed to load vendor profile:", err);
      }
    };
    fetchProfile();
  }, [getProfile, params?.username, authUser?.username, vendorProfile]);

  const copyProfileLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard");
    } catch (e) {
      toast.error("Could not copy link");
    }
  };

  const openEdit = () => {
    setFormData(vendorProfile || null);
    setShowEditModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      await checkAuth();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      navigate("/login");
    }
  };

  if (isGettingVendorProfile) return <VendorProfileSkeleton />;

  return (
    <main className="py-8 bg-n-1 min-h-[80vh]">
      <div className="container">
        {/* Cover Image Section */}
        <div className="relative bg-n-2/10 rounded-3xl overflow-hidden mb-8 border border-n-3/20 shadow-sm group">
          <div className="w-full h-32 md:h-48 lg:h-56 bg-n-3 relative">
            {vendorProfile?.coverImage ? (
              <img
                name="avatar"
                src={vendorProfile.coverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-3 to-primary-4" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 via-n-8/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10 w-full">
              <h1 className="h2 text-white mb-2 drop-shadow-md">
                {vendorProfile?.userId?.businessName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90 body-2">
                <span className="font-code uppercase tracking-wider text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  {vendorProfile?.businessCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <VendorSidebar
                vendorProfile={vendorProfile}
                authUser={authUser}
                onCopy={copyProfileLink}
                openEdit={openEdit}
                onLogout={async () => {
                  await logout();
                  window.location.href = "/login";
                }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm min-h-[400px]">
              <AboutAndProducts vendor={vendorProfile} />
            </div>

            {/* Contact Info Section */}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm">
              <VendorAddress
                vendorProfile={vendorProfile}
                authUser={authUser}
              />
            </div>
          </div>
        </div>

        {showEditModal && formData ? (
          <EditVendorProfile
            initialData={formData}
            onClose={() => setShowEditModal(false)}
          />
        ) : null}
      </div>
    </main>
  );
}
