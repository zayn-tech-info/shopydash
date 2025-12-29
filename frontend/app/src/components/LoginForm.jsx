import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { reloadApp } from "../utils/navigation";
import { useAuthStore } from "../store/authStore";

export function LoginForm() {
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

      reloadApp("/", true);
    } catch (err) {
      const msg =
        typeof err === "string" ? err : err?.message ?? "Signup failed";
      toast.error(msg);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit} className="px-8 pt-6 pb-8">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2"
            >
              Email / Client ID
            </label>
            <input
              id="email"
              type="text"
              value={email || username || schoolId}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. email@address.com or Student ID"
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-primary-3 hover:text-primary-4 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-n-4 hover:text-n-6 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-primary-3 hover:bg-primary-4 text-white rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary-3/20 hover:shadow-primary-3/40 hover:-translate-y-0.5"
          >
            Continue to Vendora
          </button>
        </div>

        {}
        <p className="mt-8 text-center text-sm text-n-4">
          New here?{" "}
          <Link
            to="/signup"
            className="font-bold text-n-8 hover:text-primary-3 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
