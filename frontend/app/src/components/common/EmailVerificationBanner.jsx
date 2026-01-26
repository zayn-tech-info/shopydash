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
    
    useAuthStore.getState().checkAuth();
  };

  const handleOpenVerify = async () => {
    if (isSending) return;
    setIsSending(true);
    try {
      await api.post("/api/v1/auth/resend-verification-code", {
        email: authUser.email,
      });
      toast.success(`Verification code sent to ${authUser.email}`);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to send verification code",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="bg-orange-500 text-white px-4 py-4 text-sm font-medium flex items-center justify-between md:justify-center gap-4 relative z-[60]">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          <span>
            Action Required: Please verify your email address ({authUser.email})
            to unlock full features.
          </span>
        </div>
        <button
          onClick={handleOpenVerify}
          disabled={isSending}
          className="bg-white text-orange-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-50 transition-colors uppercase tracking-wide whitespace-nowrap disabled:opacity-75 disabled:cursor-wait"
        >
          {isSending ? "Sending..." : "Verify Now"}
        </button>
      </div>

      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={authUser.email}
        onVerified={handleVerifySuccess}
        verifyEndpoint="/api/v1/auth/verify-email"
        resendEndpoint="/api/v1/auth/resend-verification-code"
      />
    </>
  );
};

export default EmailVerificationBanner;
