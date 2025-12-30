import { Edit, LogOut, Plus, Settings } from "lucide-react";
import UserAvatar from "../UserAvatar";
import { useClientProfileStore } from "../../store/clientProfileStore";
import { useAuthStore } from "../../store/authStore";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({
  clientProfile,
  authUser,
  openEdit,
  onLogout,
}) {
  const getProfile = useClientProfileStore((state) => state.getProfile);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const fileInputRef = useRef(null);



  const isOwner =
    authUser && clientProfile && authUser._id === clientProfile.userId?._id;

  const clientName =
    clientProfile?.userId?.fullName ||
    (isOwner ? authUser?.fullName : null) ||
    "Store";
  const username = clientProfile?.userId?.username || "vendor";

  const profileImage = isOwner
    ? authUser?.profilePic
    : clientProfile?.userId?.profilePic;

  return (
    <aside className="bg-white rounded-2xl p-6 border border-n-3/20 shadow-sm w-full">
      <div className="flex flex-col items-center">
        <div className="relative mb-4 group">
          <div className="w-32 h-32 rounded-full border-4 border-n-1 shadow-sm relative">
            <UserAvatar
              profilePic={profileImage}
              alt={clientName}
              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

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
          <div className="text-center text-sm hidden lg:block">
            <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
              Logged in as
            </div>
            <div className="truncate text-n-6 font-medium mb-2">
              {authUser?.fullName || authUser?.username || authUser?.email}
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-3 border border-n-3/20 rounded-xl text-xs font-bold uppercase tracking-wider text-n-5 hover:text-primary-3 hover:border-primary-3 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
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
