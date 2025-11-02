import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export function SignupForm({
  onSubmit,
  fullName,
  setField,
  isClient,
  username,
  email,
  schoolId,
  phoneNumber,
  whatsAppNumber,
  schoolName,
  businessName,
  showPassword,
  password,
  toggleShowPassword,
  isSigningUp,
  error,
}) {
  return (
    <div>
      {" "}
      <form onSubmit={onSubmit} noValidate className="px-8 pt-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder={isClient ? "e.g. John Doe" : "e.g. Vendora Shop"}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setField("username", e.target.value)}
              placeholder="e.g. johndoe123"
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder={
                isClient ? "e.g. john@uni.edu" : "e.g. vendor@shop.com"
              }
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              autoComplete="email"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setField("schoolId", e.target.value)}
              placeholder={isClient ? "e.g. 20221234" : "e.g.  20221334"}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setField("phoneNumber", e.target.value)}
              placeholder="e.g. +234 801 234 5678"
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={whatsAppNumber}
              onChange={(e) => setField("whatsAppNumber", e.target.value)}
              placeholder="e.g. +234 801 234 5678"
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setField("schoolName", e.target.value)}
              placeholder="e.g. University of Lagos"
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setField("businessName", e.target.value)}
              placeholder="e.g. Vendora Shop"
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
            </div>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                autoComplete="new-password"
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
        </div>

        <button
          type="submit"
          disabled={isSigningUp}
          className={[
            "mt-6 w-full rounded-lg bg-[#F97316] py-2.5 text-white text-sm font-semibold shadow-sm transition-colors",
            "hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-orange-300",
            isSigningUp ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          {isSigningUp
            ? "Creating your account..."
            : "Create your Vendora account"}
        </button>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
