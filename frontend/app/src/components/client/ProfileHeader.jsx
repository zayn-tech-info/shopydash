import { useEffect } from "react";
import { Plus } from "lucide-react";
import clientPfp from "../../assets/images/clientPfp.png";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ clientProfile }) {
  const { profileImage, fullName, username, preferredCategory } =
    clientProfile || {};
  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(clientProfile?.fullName ?? clientProfile);
  }, [clientProfile]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      navigate("/login");
    }
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 p-6 border rounded-md shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="w-40 h-40 rounded-xl overflow-hidde   mb-4 relative">
          <img
            src={profileImage || clientPfp}
            alt="avatar"
            className="w-full h-full object-cover"
          />

          <div className="w-8 h-8 text-n-1 flex items-center justify-center bg-primary-2 z-50 absolute -bottom-3 -right-4 cursor-pointer rounded-full">
            <Plus size={30} />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-n-9">
          {fullName || "No name"}
        </h2>
        <p className="text-sm text-n-6">@{username || "username"}</p>
        {preferredCategory && (
          <p className="mt-2 text-[13px] px-3 py-1 rounded-full bg-primary-2 text-n-1">
            {preferredCategory}
          </p>
        )}
      </div>

      <div className="mt-6 text-sm text-n-7 space-y-3">
        {preferredCategory && (
          <div>
            <div className="text-xs text-n-6">Preferred category</div>
            <div className="mt-1">{preferredCategory}</div>
          </div>
        )}

        <div>
          <div className="text-xs text-n-6">Member since</div>
          <div className="mt-1">
            {clientProfile?.createdAt
              ? new Date(clientProfile.createdAt).toLocaleDateString()
              : "-"}
          </div>
        </div>

        <div>
          <div className="text-xs text-n-6">Last login</div>
          <div className="mt-1">
            {clientProfile?.lastLogin
              ? new Date(clientProfile.lastLogin).toLocaleString()
              : "-"}
          </div>
        </div>
      </div>
    </aside>
  );
}
