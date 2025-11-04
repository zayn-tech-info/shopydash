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
    <div className="md:min-h-screen  my-auto mt-24 md:mt-0 bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 md:py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-orange-100 overflow-hidden">
          <div className="px-8 pt-8 text-center">
            <img
              src={logoUrl}
              alt="Vendora"
              className="mx-auto h-32 md:h-16 w-auto object-contain"
            />
            <p className="mt-3 text-base text-gray-600">
              Buy. Sell. Connect — right on campus.
            </p>
          </div>

          <div className="mt-8 px-2">
            <div className="mx-6 grid grid-cols-2 rounded-full bg-orange-50 p-1">
              <button
                type="button"
                onClick={() => {
                  setRole("vendor");
                  resetloginField();
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
                  role === "vendor"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-700",
                ].join(" ")}
                aria-pressed={role === "vendor"}
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                Vendor Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("client");
                  resetloginField();
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
                  role === "client"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-700",
                ].join(" ")}
                aria-pressed={role === "client"}
              >
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                Client Login
              </button>
            </div>
          </div>

          <LoginForm />

          <div className="px-8 pb-6">
            <p className="text-center text-base text-gray-500">
              By logging in, you agree to our{" "}
              <a className="underline hover:text-gray-700" href="#">
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
