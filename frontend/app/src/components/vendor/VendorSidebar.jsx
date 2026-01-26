import { Edit, Share2, Plus, LogOut, Settings } from "lucide-react";
import ConfirmationModal from "../common/ConfirmationModal";
import SubscriptionBadge from "../common/SubscriptionBadge";
import UserAvatar from "../UserAvatar";
import { useVendorProfileStore } from "../../store/vendorProfileStore";
import { useAuthStore } from "../../store/authStore";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useChatStore from "../../store/chatStore";

export default function VendorSidebar({
  authUser,
  vendorProfile,
  openEdit,
  onCopy,
  onLogout,
}) {
  const updateVendorProfile = useVendorProfileStore(
    (state) => state.updateVendorProfile
  );
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const getProfile = useVendorProfileStore((state) => state.getProfile);
  const { checkAccess, fetchMessages } = useChatStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isOwner = authUser?._id === vendorProfile?.userId?._id;

  const plan =
    vendorProfile?.userId?.subscriptionPlan ||
    (isOwner ? authUser?.subscriptionPlan : null);

  const businessName =
    vendorProfile?.userId?.businessName ||
    (isOwner ? authUser?.businessName : null) ||
    "Store";
  const username =
    vendorProfile?.storeUsername || vendorProfile?.userId?.username || "vendor";
  const profileImage = isOwner
    ? authUser?.profilePic
    : vendorProfile?.userId?.profilePic;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await updateProfile(formData);
      toast.success("Profile picture updated successfully");
      if (authUser?.username) {
        await getProfile(authUser.username);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture");
    }
  };

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleMessage = async () => {
    if (!authUser) {
      toast.error("Please login to message this vendor");
      return;
    }

    const recipientId = vendorProfile?.userId?._id;
    if (!recipientId) return;

    const result = await checkAccess(recipientId);

    if (result.allowed) {
      await fetchMessages(result.conversation._id);
      navigate("/messages");
    } else if (result.action === "REDIRECT_WHATSAPP") {
      setWhatsappNumber(result.data.whatsAppNumber);
      setShowPremiumModal(true);
    }
  };

  const handleContinueToWhatsapp = () => {
    if (whatsappNumber) {
      const formattedNumber = whatsappNumber.replace(/\D/g, "");
      window.open(`https:
    } else {
      toast.error("Vendor WhatsApp not available");
    }
    setShowPremiumModal(false);
  };

  return (
    <aside className="bg-white rounded-2xl p-6 border border-n-3/20 shadow-sm w-full relative">
      <div className="flex flex-col items-center">
        <div className="relative mb-4 group">
          <div className="w-32 h-32 rounded-full border-2 border-n-2 shadow-sm relative">
            <UserAvatar
              profilePic={profileImage}
              alt={businessName}
              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            {vendorProfile?.active && (
              <div className="absolute inset-0 bg-primary-3/10 pointer-events-none rounded-full" />
            )}
          </div>
        </div>

        <button
          onClick={onCopy}
          className="absolute top-2 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-n-7 hover:text-primary-3 shadow-sm border border-n-3/10 transition-colors"
          title="Share profile"
        >
          <Share2 size={16} />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <h2 className="h5 text-n-8 text-center">{businessName}</h2>
          <SubscriptionBadge plan={plan} size="sm" />
        </div>
        <p className="body-2 text-n-4 text-center font-code">@{username}</p>

        {isOwner ? (
          <button
            onClick={openEdit}
            aria-label="Edit profile"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 transition-all font-code text-xs font-bold uppercase tracking-wider bg-n-1"
            title="Edit profile"
          >
            <Edit size={16} />
            <span>Edit profile</span>
          </button>
        ) : (
          <div className="mt-6 w-full">
            <button
              onClick={handleMessage}
              className="w-full px-6 py-3 bg-primary-3 hover:bg-primary-4 text-white rounded-xl transition-colors font-code text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary-3/20"
            >
              Message
            </button>
          </div>
        )}

        <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center">
          <div className="bg-n-2/10 rounded-lg p-3">
            <div className="text-n-4 text-xs font-bold uppercase tracking-wider mb-1">
              Rating
            </div>
            <div className="text-n-8 font-bold">
              {vendorProfile?.rating ? vendorProfile.rating.toFixed(1) : "-"}
            </div>
          </div>
          <div className="bg-n-2/10 rounded-lg p-3">
            <div className="text-n-4 text-xs font-bold uppercase tracking-wider mb-1">
              Reviews
            </div>
            <div className="text-n-8 font-bold">
              {vendorProfile?.numReviews ?? 0}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-n-3/10 text-sm">
        {authUser ? (
          <div className="text-center text-sm hidden lg:block">
            <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
              Logged in as
            </div>
            <div className="truncate text-n-6 font-medium mb-2">
              {authUser?.fullName || authUser?.username || authUser?.email}
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-3 border border-n-3/20 rounded-xl text-xs font-bold uppercase tracking-wider text-n-5 hover:text-primary-3 hover:border-primary-3 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="font-medium text-n-6 mb-2">Have an account?</div>
            <a
              href="/login"
              className="inline-block px-6 py-2 bg-n-1 border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 rounded-lg transition-all font-code text-xs font-bold uppercase tracking-wider"
            >
              Login
            </a>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onConfirm={handleContinueToWhatsapp}
        title="Premium Vendor Only"
        message="This vendor is not on our Premium plan"
        confirmText="Continue to WhatsApp"
        cancelText="Cancel"
      />
    </aside>
  );
}
