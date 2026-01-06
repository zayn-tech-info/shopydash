import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { api } from "../lib/axios";
import { Loader, MoveRight, RefreshCcw } from "lucide-react";
import logoUrl from "../assets/images/shopydash_logo.png";

export const VerifyEmail = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("No email to verify");
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
 
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

    
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/api/v1/auth/verify-email", {
        email,
        code: verificationCode,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      await checkAuth();
      toast.success("Email verified successfully");

      const { reloadApp } = await import("../utils/navigation");
      reloadApp("/", true);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Verification failed";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/api/v1/auth/resend-code", { email });
      toast.success("Verification code resent");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-3/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-2/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 md:backdrop-blur-xl shadow-2xl shadow-n-3/10 rounded-3xl border border-white/50 overflow-hidden p-8">
          <div className="text-center mb-8">
            <img
              src={logoUrl}
              alt="Shopydash"
              className="mx-auto w-12 object-contain mb-4"
            />
            <h2 className="text-2xl font-bold text-n-8 mb-2">
              Verify Your Email
            </h2>
            <p className="text-n-4 text-sm">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-n-8">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-n-2 border border-n-3 rounded-xl focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 outline-none transition-all text-n-8"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.some((digit) => !digit)}
              className="w-full bg-primary-3 hover:bg-primary-3/90 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Email <MoveRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-n-4 hover:text-primary-3 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <RefreshCcw className="w-4 h-4" /> Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
