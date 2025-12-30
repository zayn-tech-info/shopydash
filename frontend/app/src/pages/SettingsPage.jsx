import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { SettingsSidebar } from "../components/settings/SettingsSidebar";
import { ProfileSettings } from "../components/settings/ProfileSettings";
import { SecuritySettings } from "../components/settings/SecuritySettings";
import { AccountInfo } from "../components/settings/AccountInfo";
import { BusinessProfile } from "../components/settings/BusinessProfile";
import { NotificationSettings } from "../components/settings/NotificationSettings";
import { OrdersSettings } from "../components/settings/OrdersSettings";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!authUser) return null;

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={authUser} />;
      case "security":
        return <SecuritySettings />;
      case "account":
        return <AccountInfo user={authUser} />;
      case "business":
        return <BusinessProfile user={authUser} />;
      case "notifications":
        return <NotificationSettings />;
      case "orders":
        return <OrdersSettings />;
      default:
        return <ProfileSettings user={authUser} />;
    }
  };

  return (
    <main className="py-8 bg-n-1 min-h-[85vh]">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            role={authUser.role}
            onLogout={handleLogout}
          />

          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-n-3/20 shadow-sm min-h-[500px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
