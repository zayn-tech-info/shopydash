import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { User, Store, Bell, Shield, ChevronRight } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function SettingItem({ icon: Icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left"
    >
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon size={20} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  );
}

function SettingsTabComponent() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const profileUrl = `/p/${authUser?.username}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account and store</p>
      </div>

      {/* Settings List */}
      <div className="space-y-3">
        <SettingItem
          icon={User}
          title="Account"
          description="Update your personal information"
          onClick={() => navigate(profileUrl)}
        />
        <SettingItem
          icon={Store}
          title="Store Profile"
          description="Edit your store details and branding"
          onClick={() => navigate(profileUrl)}
        />
        <SettingItem
          icon={Bell}
          title="Notifications"
          description="Configure notification preferences"
          onClick={() => navigate("/notifications")}
        />
        <SettingItem
          icon={Shield}
          title="Security"
          description="Password and security settings"
          onClick={() => navigate(profileUrl)}
        />
      </div>
    </div>
  );
}

export const SettingsTab = memo(SettingsTabComponent);
