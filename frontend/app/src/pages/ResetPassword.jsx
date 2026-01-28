import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import logoUrl from "../assets/images/shopydash_logo.png";
import { Eye, EyeOff } from "lucide-react";

export function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, forgotPassword, isLogginIn } = useAuthStore();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword, confirmPassword });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is missing. Please go back to forgot password page.");
      return;
    }

    try {
      await forgotPassword(email);
      toast.success("Reset code resent successfully");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-3/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary-2/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-n-3/10 rounded-3xl border border-white/50 overflow-hidden">
          <div className="px-8 pt-10 text-center">
            <Link to="/" className="inline-block">
              <img
                src={logoUrl}
                alt="Shopydash"
                className="mx-auto h-12 w-auto object-contain mb-4 hover:scale-105 transition-transform"
              />
            </Link>
            <h2 className="h4 text-n-8 mb-2">Reset Password</h2>
            <p className="body-2 text-n-4">
              Enter the code sent to your email and your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
            <div className="space-y-4">
              <div>
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8"
                  required
                />
              </div>

              <div>
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Reset Code (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8"
                  required
                />
              </div>

              <div>
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-n-4 hover:text-n-6 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLogginIn}
                className="w-full h-12 bg-primary-3 hover:bg-primary-4 text-white rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary-3/20 hover:shadow-primary-3/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isLogginIn ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLogginIn}
                  className="text-n-4 hover:text-primary-3 transition-colors text-sm font-bold disabled:opacity-50"
                >
                  Didn't receive code? Resend
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
