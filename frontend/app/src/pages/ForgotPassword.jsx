import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import logoUrl from "../assets/images/shopydash_logo.png";
import { ArrowLeft } from "lucide-react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const { forgotPassword, isLogginIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      await forgotPassword(email);
      toast.success("Reset code sent to your email");
      navigate("/reset-password", { state: { email } });
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
            <h2 className="h4 text-n-8 mb-2">Forgot Password</h2>
            <p className="body-2 text-n-4">
              Enter your email to receive a reset code
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLogginIn}
                className="w-full h-12 bg-primary-3 hover:bg-primary-4 text-white rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary-3/20 hover:shadow-primary-3/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogginIn ? "Sending..." : "Send Reset Code"}
              </button>
            </div>

            <div className="mt-8 text-center text-sm">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 font-bold text-n-6 hover:text-primary-3 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
