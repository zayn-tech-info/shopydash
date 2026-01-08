import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { AlertCircle } from "lucide-react";
import { VerificationModal } from "../VerificationModal";
import { api } from "../../lib/axios";
import toast from "react-hot-toast";

const EmailVerificationBanner = () => {
  const { authUser, updateUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!authUser || authUser.isVerified) return null;

  const handleVerifySuccess = () => {
    updateUser({ isVerified: true });
    // Optionally refresh full user data
    useAuthStore.getState().checkAuth(); 
  };

  const handleOpenVerify = async () => {
    // Optionally send code immediately when opening, or let modal handle resend
    // Modal sends on "Resend Code" click, but initially it expects user to have code.
    // If user deleted old email, they might need a new code.
    // Let's rely on Modal's flow or trigger a send here if needed. 
    // Usually, "Verify Now" implies "I have a code" or "Send me a code".
    // Let's just open the modal. User can click "Resend Code" in modal if they don't have one.
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-orange-500 text-white px-4 py-4 text-sm font-medium flex items-center justify-between md:justify-center gap-4 relative z-[60]">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          <span>
            Action Required: Please verify your email address ({authUser.email}) to unlock full features.
          </span>
        </div>
        <button
          onClick={handleOpenVerify}
          className="bg-white text-orange-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-50 transition-colors uppercase tracking-wide whitespace-nowrap"
        >
          Verify Now
        </button>
      </div>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={authUser.email}
        onVerified={handleVerifySuccess}
      />
    </>
  );
};

export default EmailVerificationBanner;
