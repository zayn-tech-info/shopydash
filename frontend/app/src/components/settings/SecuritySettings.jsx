import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";
import { Lock, ShieldCheck } from "lucide-react";
import { InputField } from "../InputField";

export function SecuritySettings() {
  const { changePassword } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (formData.currentPassword === formData.newPassword) {
      return toast.error("New password cannot be the same as current password");
    }

    setLoading(true);
    try {
      await changePassword(formData);
      toast.success("Password changed successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8">Security</h2>
        <p className="text-n-4 mt-1">
          Manage your password and security preferences.
        </p>
      </div>

      <div className="bg-primary-3/5 rounded-xl p-6 mb-8 border border-primary-3/10 flex items-start gap-4">
        <ShieldCheck className="text-primary-3 w-8 h-8 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-n-8 mb-1">Secure Your Account</h4>
          <p className="text-sm text-n-5">
            Use a strong password with at least 8 characters, including numbers
            and symbols, to keep your Shopydash account safe.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <InputField
              label="Current Password"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange("currentPassword")}
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              placeholder="••••••••"
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-n-8 text-white rounded-xl font-bold hover:bg-n-7 transition-all disabled:opacity-70"
          >
            <Lock size={18} />
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
