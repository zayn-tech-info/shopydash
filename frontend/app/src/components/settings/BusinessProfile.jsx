import { useState, useEffect } from "react";
import { useVendorProfileStore } from "../../store/vendorProfileStore";
import { InputField } from "../InputField";
import { toast } from "react-hot-toast";
import { Store, Tag, FileText } from "lucide-react";
import { preferredCategories } from "../../constants";

export function BusinessProfile({ user }) {
  const {
    vendorProfile,
    isGettingVendorProfile,
    getProfile,
    updateVendorProfile,
    isUpdatingVendorProfile,
  } = useVendorProfileStore();

  const [formData, setFormData] = useState({
    businessName: "",
    storeDescription: "",
    phoneNumber: "",
    businessCategory: "",
    
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!vendorProfile && user?.username) {
        await getProfile(user.username);
      }
    };
    fetchProfile();
  }, [user, vendorProfile, getProfile]);

  useEffect(() => {
    if (vendorProfile) {
      setFormData({
        businessName:
          vendorProfile.userId?.businessName ||
          vendorProfile.businessName ||
          "",
        phoneNumber:
          vendorProfile.userId?.phoneNumber || vendorProfile.phoneNumber || "",
        storeDescription: vendorProfile.storeDescription || "",
        businessCategory: vendorProfile.businessCategory || "",
      });
    }
  }, [vendorProfile]);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVendorProfile(formData);
      toast.success("Business profile updated");
    } catch (error) {
      console.error(error);
    }
  };

  if (isGettingVendorProfile)
    return (
      <div className="p-8 text-center text-n-5">
        Loading Business Profile...
      </div>
    );

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8">Business Profile</h2>
        <p className="text-n-4 mt-1">
          Manage how your store appears to customers on Shopydash.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Business Name"
            value={formData.businessName}
            onChange={handleChange("businessName")}
            placeholder="My Awesome Store"
          />
          <InputField
            label="Business Phone"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            placeholder="+234..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-n-6 mb-2 flex items-center gap-2">
            <FileText size={16} />
            Store Description
          </label>
          <textarea
            className="w-full px-4 py-3 bg-white border border-n-3 rounded-xl text-n-8 focus:outline-none focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 transition-all min-h-[120px]"
            value={formData.storeDescription}
            onChange={handleChange("storeDescription")}
            placeholder="Tell customers what you sell..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-n-6 mb-2 flex items-center gap-2">
            <Tag size={16} />
            Business Category
          </label>
          <select
            className="w-full px-4 py-3 bg-white border border-n-3 rounded-xl text-n-8 focus:outline-none focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 transition-all appearance-none"
            value={formData.businessCategory}
            onChange={handleChange("businessCategory")}
          >
            <option value="">Select a category</option>
            {preferredCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-6 border-t border-n-3/20">
          <button
            type="submit"
            disabled={isUpdatingVendorProfile}
            className="flex items-center gap-2 px-8 py-3 bg-n-8 text-white rounded-xl font-bold hover:bg-n-7 transition-all disabled:opacity-70"
          >
            <Store size={18} />
            {isUpdatingVendorProfile
              ? "Updating Store..."
              : "Update Business Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
