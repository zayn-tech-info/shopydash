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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder={isClient ? "e.g. John Doe" : "e.g. Vendora Shop"}
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setField("username", e.target.value)}
              placeholder="e.g. johndoe123"
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder={
                isClient ? "e.g. john@uni.edu" : "e.g. vendor@shop.com"
              }
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              autoComplete="email"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              Student ID
            </label>
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setField("schoolId", e.target.value)}
              placeholder={isClient ? "e.g. 20221234" : "e.g.  20221334"}
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setField("phoneNumber", e.target.value)}
              placeholder="e.g. +234 801..."
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              value={whatsAppNumber}
              onChange={(e) => setField("whatsAppNumber", e.target.value)}
              placeholder="e.g. +234 801..."
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
            />
          </div>

          <div>
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              School Name
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setField("schoolName", e.target.value)}
              placeholder="e.g. UNILAG"
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setField("businessName", e.target.value)}
              placeholder="e.g. Vendora Shop"
              className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="Create a strong password"
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                autoComplete="new-password"
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
        </div>

        <button
          type="submit"
          disabled={isSigningUp}
          className={[
            "mt-8 w-full h-12 bg-primary-3 hover:bg-primary-4 text-white rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary-3/20 hover:shadow-primary-3/40 hover:-translate-y-0.5",
            isSigningUp ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          {isSigningUp
            ? "Creating your account..."
            : "Create your Vendora account"}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-primary-3 font-medium">
            {error}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-n-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-n-8 hover:text-primary-3 transition-colors"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
