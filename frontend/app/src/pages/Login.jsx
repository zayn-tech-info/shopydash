 import { useAuthStore } from "../store/authStore";
import { ShoppingBag, GraduationCap, Eye, EyeOff } from "lucide-react";
import logoUrl from "../assets/images/vendora_logo.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function Login() {
  const navigate = useNavigate();
  const {
    role,
    email,
    schoolId,
    username,
    password,
    showPassword,
    setRole,
    setEmail,
    setPassword,
    toggleShowPassword,
    resetloginField,
    login,
  } = useAuthStore();

  const validateForm = () => {
    const trimmed = {
      email: email?.trim() ?? "",
      password: password?.trim() ?? "",
      schoolId: schoolId?.trim() ?? "",
      username: username?.trim() ?? "",
    };

    if (!trimmed.password) return toast.error("Password is required"), false;

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
      username,
      schoolId,
    };

    const ok = validateForm();
    if (!ok) {
      return;
    }

    try {
      const result = await login(payload);
      toast.success("User Logged in successfully!");
      resetloginField();
      navigate("/");
    } catch (err) {
      const msg =
        typeof err === "string" ? err : err?.message ?? "Signup failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-orange-100 overflow-hidden">
          {/* Header / Logo */}
          <div className="px-8 pt-8 text-center">
            <img
              src={logoUrl}
              alt="Vendora"
              className="mx-auto h-12 w-auto object-contain"
            />
            <p className="mt-3 text-sm text-gray-600">
              Buy. Sell. Connect — right on campus.
            </p>
          </div>

          {/* Role Toggle */}
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

          {/* Form */}
          <form onSubmit={onSubmit} className="px-8 pt-6 pb-8">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email / Client ID
                </label>
                <input
                  id="email"
                  type="text"
                  value={email || username || schoolId}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "client"
                      ? "e.g. john.doe@uni.edu or 20231234"
                      : "e.g. vendor@shop.com"
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={[
                  "mt-2 w-full rounded-lg bg-[#F97316] py-2.5 text-white text-sm font-semibold shadow-sm transition-colors",
                  "hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-orange-300",
                ].join(" ")}
              >
                Continue to Vendora
              </button>
            </div>

            {/* Create Account */}
            <p className="mt-4 text-center text-sm text-gray-600">
              New here?{" "}
              <Link
                to="/signup"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Create an account
              </Link>
            </p>
          </form>

          <div className="px-8 pb-6">
            <p className="text-center text-xs text-gray-500">
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
