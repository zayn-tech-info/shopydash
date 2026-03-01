import { toast } from "react-hot-toast";
import Logo from "../assets/images/shopydash_logo.png";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import useChatStore from "../store/chatStore";
import { EditVendorProfile } from "../components/vendor/EditVendorProfile";
import VendorProfileHeader from "../components/vendor/VendorProfileHeader";
import AboutAndProducts from "../components/vendor/AboutAndProducts";
import { VendorAddress } from "../components/vendor/VendorAddress";
import { VendorProfileSkeleton } from "../components/skeletons/VendorProfileSkeleton";
import ConfirmationModal from "../components/common/ConfirmationModal";
import AuthRequiredModal from "../components/common/AuthRequiredModal";

export default function VendorProfile() {
  const isGettingVendorProfile = useVendorProfileStore(
    (state) => state.isGettingVendorProfile,
  );

  const vendorProfile = useVendorProfileStore((state) => state.vendorProfile);
  const getProfile = useVendorProfileStore((state) => state.getProfile);
  const updateCoverImage = useVendorProfileStore((state) => state.updateCoverImage);
  const isUpdatingVendorProfile = useVendorProfileStore((state) => state.isUpdatingVendorProfile);

  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const navigate = useNavigate();

  const params = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { checkAccess, fetchMessages } = useChatStore();

  const isOwner = authUser?._id === vendorProfile?.userId?._id;
  const displayProfileImage = isOwner
    ? authUser?.profilePic || vendorProfile?.userId?.profilePic || Logo
    : vendorProfile?.userId?.profilePic || Logo;

  const vendorLocation = [
    vendorProfile?.userId?.city,
    vendorProfile?.userId?.state,
    vendorProfile?.userId?.country,
  ]
    .filter(Boolean)
    .join(", ");

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

  const copyProfileLink = useCallback(async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard");
    } catch (e) {
      toast.error("Could not copy link");
    }
  }, []);

  const openEdit = useCallback(() => {
    setFormData(vendorProfile || null);
    setShowEditModal(true);
  }, [vendorProfile]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      await checkAuth();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      navigate("/login");
    }
  }, [logout, checkAuth, navigate]);

  const handleMessage = useCallback(async () => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const recipientId = vendorProfile?.userId?._id;
    if (!recipientId) return;
    const result = await checkAccess(recipientId);
    if (result.allowed) {
      await fetchMessages(result.conversation._id);
      navigate("/messages");
    } else if (result.action === "REDIRECT_WHATSAPP") {
      setWhatsappNumber(result.data.whatsAppNumber ?? "");
      setShowPremiumModal(true);
    }
  }, [authUser, vendorProfile?.userId?._id, checkAccess, fetchMessages, navigate]);

  const handleContinueToWhatsapp = useCallback(() => {
    if (whatsappNumber) {
      const formatted = whatsappNumber.replace(/\D/g, "");
      window.open(`https://wa.me/${formatted}`, "_blank");
    } else {
      toast.error("Vendor WhatsApp not available");
    }
    setShowPremiumModal(false);
  }, [whatsappNumber]);

  const handleCoverUpload = useCallback(
    async (file) => {
      try {
        await updateCoverImage(file);
        const usernameToRefetch = params?.username || authUser?.username;
        if (usernameToRefetch) await getProfile(usernameToRefetch);
        toast.success("Cover image updated");
      } catch (e) {
        toast.error(e?.message || "Failed to update cover image");
      }
    },
    [updateCoverImage, getProfile, params?.username, authUser?.username]
  );

  if (isGettingVendorProfile) return <VendorProfileSkeleton />;

  const plan =
    vendorProfile?.userId?.subscriptionPlan ||
    (isOwner ? authUser?.subscriptionPlan : null);

  const businessName =
    vendorProfile?.userId?.businessName ||
    (isOwner ? authUser?.businessName : null) ||
    "Store";
  const username =
    vendorProfile?.storeUsername || vendorProfile?.userId?.username || "vendor";

  return (
    <main className="min-h-[80vh] bg-n-1">
      <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[80rem] 2xl:max-w-[90rem] mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-4 sm:py-6 md:py-8">
        {/* Twitter-style profile header */}
        <VendorProfileHeader
          vendorProfile={vendorProfile}
          authUser={authUser}
          isOwner={isOwner}
          plan={plan}
          displayProfileImage={displayProfileImage}
          businessName={businessName}
          username={username}
          vendorLocation={vendorLocation}
          onCopy={copyProfileLink}
          openEdit={openEdit}
          onSettings={() => navigate("/settings")}
          onMessage={handleMessage}
          onCoverUpload={handleCoverUpload}
          isCoverUploading={isUpdatingVendorProfile}
        />

        {/* Main content - single column, full width */}
        <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-n-3/20 shadow-sm min-h-[320px]">
            <AboutAndProducts vendor={vendorProfile} />
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-n-3/20 shadow-sm">
            <VendorAddress
              vendorProfile={vendorProfile}
              authUser={authUser}
            />
          </div>
        </div>

        {/* Auth card: logged-in (logout) or guest (login CTA) */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-4 sm:p-6 border border-n-3/20 shadow-sm">
          {authUser ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-0.5">
                  Logged in as
                </div>
                <div className="truncate text-n-6 font-medium">
                  {authUser?.fullName || authUser?.username || authUser?.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-n-3/20 rounded-xl text-xs font-bold uppercase tracking-wider text-n-5 hover:text-primary-3 hover:border-primary-3 transition-all shrink-0"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="font-medium text-n-6 mb-3">Have an account?</p>
              <a
                href="/login"
                className="inline-block px-6 py-2.5 bg-n-1 border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 rounded-xl font-code text-xs font-bold uppercase tracking-wider transition-all"
              >
                Login
              </a>
            </div>
          )}
        </div>

        {showEditModal && formData ? (
          <EditVendorProfile
            initialData={formData}
            onClose={() => setShowEditModal(false)}
          />
        ) : null}
      </div>

      <ConfirmationModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onConfirm={handleContinueToWhatsapp}
        title="Premium Vendor Only"
        message="This vendor is not on our Premium plan. You can continue to WhatsApp to contact them."
        confirmText="Continue to WhatsApp"
        cancelText="Cancel"
      />

      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Login to Message"
        message="You need to be logged in to message this vendor. Create an account or login to start a conversation."
        cancelText="Cancel"
      />
    </main>
  );
}
