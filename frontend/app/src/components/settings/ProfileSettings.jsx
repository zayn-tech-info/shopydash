import { useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";
import { Camera, MapPin, School } from "lucide-react";
import { schools } from "../../constants";
import { InputField } from "../InputField";

import UserAvatar from "../UserAvatar";

export function ProfileSettings({ user }) {
  const { updateProfile, isUpdatingProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    username: user.username || "",
    phoneNumber: user.phoneNumber || "",
    state: user.state || "",
    city: user.city || "",
    schoolArea: user.schoolArea || "",
    country: user.country || "Nigeria",
    schoolName: user.schoolName || "",
  });

  const [previewImage, setPreviewImage] = useState(user.profilePic);
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const formPayload = new FormData();
    formPayload.append("avatar", file);

    try {
      await updateProfile(formPayload);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });

      await updateProfile(formPayload);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8">Profile Information</h2>
        <p className="text-n-4 mt-1">
          Update your personal information and public profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-center gap-6">
          <div className="relative group w-24 h-24">
            <UserAvatar
              profilePic={previewImage}
              alt="Profile"
              className="w-full h-full border-2 border-n-3"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white cursor-pointer"
            >
              <Camera size={24} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h4 className="font-bold text-n-8">Profile Picture</h4>
            <p className="text-sm text-n-4 mt-1">PNG, JPG or WEBP. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange("fullName")}
            placeholder="John Doe"
          />

          <InputField
            label="Username"
            value={formData.username}
            onChange={handleChange("username")}
            placeholder="johndoe"
          />

          <InputField
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange("phoneNumber")}
            placeholder="+234..."
          />
        </div>

        <div className="pt-4 border-t border-n-3/20">
          <h4 className="flex items-center gap-2 font-bold text-n-7 mb-4">
            <School size={18} />
            School & Location
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-n-6 mb-1.5">
                School Name (Read Only)
              </label>
              <input
                type="text"
                value={formData.schoolName}
                readOnly
                className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
              />
            </div>

            <InputField
              label="School Area / Lodge"
              value={formData.schoolArea}
              onChange={handleChange("schoolArea")}
              placeholder="e.g Under G, Adenike..."
            />

            <InputField
              label="City"
              value={formData.city}
              onChange={handleChange("city")}
            />

            <InputField
              label="State"
              value={formData.state}
              onChange={handleChange("state")}
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="px-8 py-3 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-4 transition-all disabled:opacity-70"
          >
            {isUpdatingProfile ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
