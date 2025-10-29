import logoUrl from "../assets/images/vendora_logo.png";
import { useMemo } from "react";
import { useSignupStore } from "../store/signup";
import { GraduationCap, Store, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export function Signup() {
  const {
    role,
    showPassword,
    student,
    vendor,
    setRole,
    toggleShowPassword,
    setStudentField,
    setVendorField,
    resetStudent,
    resetVendor,
  } = useSignupStore();

  const isStudent = role === "student";

  const isSubmitDisabled = useMemo(() => {
    if (isStudent) {
      return (
        !student.fullName ||
        !student.emailOrId ||
        !student.password ||
        !student.phone ||
        !student.schoolName
      );
    }
    return (
      !vendor.fullName ||
      !vendor.email ||
      !vendor.password ||
      !vendor.whatsapp ||
      !vendor.schoolName
    );
  }, [isStudent, student, vendor]);

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder: you can hook up your backend here
    const payload = isStudent ? { role, ...student } : { role, ...vendor };
    console.log("Signup submit", payload);
  };

  const switchTo = (nextRole) => {
    setRole(nextRole);
    if (nextRole === "student") resetStudent();
    else resetVendor();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-orange-100 overflow-hidden">
          {/* Header / Logo */}
          <div className="px-8 pt-8 text-center">
            <img
              src={logoUrl}
              alt="Vendora"
              className="mx-auto h-12 w-auto object-contain"
            />
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Join the campus marketplace to buy and sell with ease.
            </p>
          </div>

          {/* Role Toggle */}
          <div className="mt-8 px-2">
            <div className="mx-6 grid grid-cols-2 rounded-full bg-orange-50 p-1">
              <button
                type="button"
                onClick={() => switchTo("student")}
                className={[
                  "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
                  isStudent
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-700",
                ].join(" ")}
                aria-pressed={isStudent}
              >
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                Student Buyer
              </button>
              <button
                type="button"
                onClick={() => switchTo("vendor")}
                className={[
                  "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
                  !isStudent
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-700",
                ].join(" ")}
                aria-pressed={!isStudent}
              >
                <Store className="w-4 h-4" aria-hidden="true" />
                Vendor
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-8 pt-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name / Business Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {isStudent ? "Full Name" : "Full Name / Business Name"}
                </label>
                <input
                  type="text"
                  value={isStudent ? student.fullName : vendor.fullName}
                  onChange={(e) =>
                    isStudent
                      ? setStudentField("fullName", e.target.value)
                      : setVendorField("fullName", e.target.value)
                  }
                  placeholder={
                    isStudent
                      ? "e.g. John Doe"
                      : "e.g. Jane Doe or Vendora Shop"
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              {/* Email / Student ID OR Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  {isStudent ? "Email / Student ID" : "Email"}
                </label>
                <input
                  type={isStudent ? "text" : "email"}
                  value={isStudent ? student.emailOrId : vendor.email}
                  onChange={(e) =>
                    isStudent
                      ? setStudentField("emailOrId", e.target.value)
                      : setVendorField("email", e.target.value)
                  }
                  placeholder={
                    isStudent
                      ? "e.g. john@uni.edu or 20231234"
                      : "e.g. vendor@shop.com"
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                </div>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={isStudent ? student.password : vendor.password}
                    onChange={(e) =>
                      isStudent
                        ? setStudentField("password", e.target.value)
                        : setVendorField("password", e.target.value)
                    }
                    placeholder="Create a strong password"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                    autoComplete="new-password"
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

              {/* WhatsApp / Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isStudent ? "Phone Number (WhatsApp)" : "WhatsApp Number"}
                </label>
                <input
                  type="tel"
                  value={isStudent ? student.phone : vendor.whatsapp}
                  onChange={(e) =>
                    isStudent
                      ? setStudentField("phone", e.target.value)
                      : setVendorField("whatsapp", e.target.value)
                  }
                  placeholder="e.g. +234 801 234 5678"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              {/* School Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Name
                </label>
                <input
                  type="text"
                  value={isStudent ? student.schoolName : vendor.schoolName}
                  onChange={(e) =>
                    isStudent
                      ? setStudentField("schoolName", e.target.value)
                      : setVendorField("schoolName", e.target.value)
                  }
                  placeholder="e.g. University of Lagos"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={[
                "mt-6 w-full rounded-lg bg-[#F97316] py-2.5 text-white text-sm font-semibold shadow-sm transition-colors",
                "hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-orange-300",
                isSubmitDisabled
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer",
              ].join(" ")}
            >
              Create your Vendora account
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login">
                <a className="font-medium text-orange-600 hover:text-orange-700">
                  Log in
                </a>
              </Link>
            </p>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6">
            <p className="text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
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
