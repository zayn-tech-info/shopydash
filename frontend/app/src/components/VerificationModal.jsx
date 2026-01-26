import { useState, useRef, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "../lib/axios";

export const VerificationModal = ({
  isOpen,
  onClose,
  email,
  onVerified,
  verifyEndpoint = "/api/v1/auth/validate-otp",
  resendEndpoint = "/api/v1/auth/send-otp",
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter complete code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post(verifyEndpoint, {
        email,
        code: verificationCode,
      });
      toast.success("Email verified successfully!");
      onVerified();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post(resendEndpoint, { email });
      toast.success("Code resent!");
    } catch (err) {
      toast.error("Failed to resend code");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-n-4 hover:text-n-6 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-n-8 mb-2">Verify Email</h3>
          <p className="text-sm text-n-4">
            Enter the code sent to{" "}
            <span className="font-semibold text-n-8">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-n-2/30 border border-n-3 rounded-lg focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 outline-none transition-all text-n-8"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || code.some((c) => !c)}
            className="w-full bg-primary-3 hover:bg-primary-4 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Verify Code"
            )}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="w-full mt-4 text-sm text-n-8 border py-3 rounded-xl border-gray-500 hover:text-primary-3"
          >
            Resend Code
          </button>
        </form>
      </div>
    </div>
  );
};
