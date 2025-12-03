import { useEffect, useRef } from "react";
import { Edit, Plus, MapPin, Camera } from "lucide-react";
import clientPfp from "../../assets/images/clientPfp.png";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/clientPfp.png";
import { useClientProfileStore } from "../../store/clientProfileStore";
import toast from "react-hot-toast";

export default function ProfileHeader({ clientProfile, authUser, openEdit }) {
  const updateClientProfile = useClientProfileStore(
    (state) => state.updateClientProfile
  );
  const fileInputRef = useRef(null);

  const clientName =
    clientProfile?.userId?.fullName || authUser?.fullName || "Store";
  const username = clientProfile?.userId?.username || "vendor";
  const profileImage = clientProfile?.userId?.profilePic || Logo;

  const isOwner =
    authUser && clientProfile && authUser._id === clientProfile.userId?._id;

  const handleImageClick = () => {
    if (isOwner) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await updateClientProfile(formData);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  return (
    <aside className="bg-white rounded-2xl p-6 border border-n-3/20 shadow-sm w-full">
      <div className="flex flex-col items-center">
        <div
          className={`w-32 h-32 rounded-full overflow-hidden border-4 border-n-1 shadow-sm mb-4 relative group ${
            isOwner ? "cursor-pointer" : ""
          }`}
          onClick={handleImageClick}
        >
          <img
            src={profileImage}
            alt={clientName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isOwner && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white" size={24} />
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <h2 className="h4 text-n-8 text-center mb-1">{clientName}</h2>
        <p className="body-2 text-n-4 text-center font-code">@{username}</p>

        {isOwner ? (
          <button
            onClick={openEdit}
            aria-label="Edit profile"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 transition-all font-code text-xs font-bold uppercase tracking-wider bg-n-1"
            title="Edit profile"
          >
            <Edit size={16} />
            <span>Edit profile</span>
          </button>
        ) : (
          <div className="mt-6 w-full">
            <button className="w-full px-6 py-3 bg-primary-3 hover:bg-primary-4 text-white rounded-xl transition-colors font-code text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary-3/20">
              Message
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-n-3/10 text-sm">
        {authUser ? (
          <div className="text-center text-sm md:block hidden">
            <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
              Logged in as
            </div>
            <div className="truncate text-n-6 font-medium">
              {authUser?.fullName || authUser?.username || authUser?.email}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="font-medium text-n-6 mb-2">Have an account?</div>
            <a
              href="/login"
              className="inline-block px-6 py-2 bg-n-1 border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 rounded-lg transition-all font-code text-xs font-bold uppercase tracking-wider"
            >
              Login
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
