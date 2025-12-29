import { useAuthStore } from "../store/authStore";
import { useGoogleLogin } from "@react-oauth/google";
import logoUrl from "../assets/images/vendora_logo.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginForm } from "../components/LoginForm";

export function Login() {
  const navigate = useNavigate();
  const { role, setRole, resetloginField, googleAuthenticate } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleAuthenticate(tokenResponse.access_token);
        if (res.success) {
          if (!res.profileComplete) {
            toast.success("Please complete your profile");
            const { reloadApp } = await import("../utils/navigation");
            reloadApp("/complete-user-registration", true);
          } else {
            toast.success("Logged in successfully!");
            const { reloadApp } = await import("../utils/navigation");
            reloadApp("/", true);
          }
        }
      } catch (err) {
        const msg =
          typeof err === "string" ? err : err?.message || "Google Login Failed";
        toast.error(msg);
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {}
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
                alt="Vendora"
                className="mx-auto h-12 w-auto object-contain mb-4 hover:scale-105 transition-transform"
              />
            </Link>
            <h2 className="h4 text-n-8 mb-2">Welcome back</h2>
            <p className="body-2 text-n-4">
              Buy. Sell. Connect — right on campus.
            </p>
          </div>

          <div className="mt-6 px-8">
            <button
              type="button"
              onClick={() => googleLogin()}
              className="w-full h-12 bg-white border border-n-3/10 hover:bg-n-2/10 text-n-8 rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.04-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-n-3/10"></div>
              </div>
              <div className="relative bg-white px-4 text-xs text-n-4 uppercase tracking-wider font-bold">
                Or continue with
              </div>
            </div>
          </div>

          <div className="mt-2">
            <LoginForm />
          </div>

          <div className="px-8 pb-8">
            <p className="text-center text-xs text-n-4">
              By logging in, you agree to our{" "}
              <a
                className="font-bold text-n-6 hover:text-primary-3 transition-colors"
                href="#"
              >
                Terms of Use
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
