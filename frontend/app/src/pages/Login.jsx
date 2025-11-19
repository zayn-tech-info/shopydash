import { useAuthStore } from "../store/authStore";
import { ShoppingBag, GraduationCap, Eye, EyeOff } from "lucide-react";
import logoUrl from "../assets/images/vendora_logo.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginForm } from "../components/LoginForm";

export function Login() {
  const navigate = useNavigate();
  const { role, setRole, resetloginField } = useAuthStore();

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
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

          <div className="mt-8 px-6">
            <div className="grid grid-cols-2 p-1 bg-n-2/10 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRole("vendor");
                  resetloginField();
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                  role === "vendor"
                    ? "bg-white text-primary-3 shadow-sm"
                    : "text-n-4 hover:text-n-6 hover:bg-white/50",
                ].join(" ")}
              >
                <ShoppingBag className="w-4 h-4" />
                Vendor
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("client");
                  resetloginField();
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                  role === "client"
                    ? "bg-white text-primary-3 shadow-sm"
                    : "text-n-4 hover:text-n-6 hover:bg-white/50",
                ].join(" ")}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
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
