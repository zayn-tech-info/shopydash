import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export function LoginForm(
  onSubmit,
  email,
  username,
  schoolId,
  setEmail,
  role,
  showPassword,
  password,
  setPassword,
  toggleShowPassword
) {
  return (
    <div>
      {" "}
      <form onSubmit={onSubmit} className="px-8 pt-6 pb-8">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-700"
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
                className="block text-base font-medium text-gray-700"
              >
                Password
              </label>
              <a
                href="#"
                className="text-base text-orange-600 hover:text-orange-700"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
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
              "mt-2 w-full rounded-lg bg-[#F97316] py-2.5 text-white font-semibold shadow-sm text-base transition-colors",
              "hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-orange-300",
            ].join(" ")}
          >
            Continue to Vendora
          </button>
        </div>

        {/* Create Account */}
        <p className="mt-4 text-center text-base text-gray-600">
          New here?{" "}
          <Link
            to="/signup"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
