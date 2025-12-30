import {
  User,
  Shield,
  CreditCard,
  Store,
  Bell,
  Info,
  LogOut,
  ShoppingBag,
} from "lucide-react";

export function SettingsSidebar({ activeTab, setActiveTab, role, onLogout }) {
  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "account", label: "Account Info", icon: Info },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "orders", label: "Orders", icon: ShoppingBag },
  ];

  if (role === "vendor") {
    menuItems.splice(3, 0, {
      id: "business",
      label: "Business Profile",
      icon: Store,
    });
  }

  return (
    <div className="w-full lg:w-64 flex-shrink-0 bg-white lg:rounded-2xl border border-n-3/20 shadow-sm overflow-hidden h-fit">
      <div className="p-4 border-b border-n-3/20 lg:block hidden">
        <h2 className="text-lg font-bold text-n-8">Settings</h2>
      </div>

      {/* Mobile Horizontal Scroll */}
      <div className="flex lg:block overflow-x-auto lg:overflow-visible p-2 lg:p-3 space-x-2 lg:space-x-0 lg:space-y-1 scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap lg:w-full w-auto flex-shrink-0 ${
                isActive
                  ? "bg-primary-3 text-white shadow-md shadow-primary-3/20"
                  : "text-n-6 hover:bg-n-2 hover:text-n-8"
              }`}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}

        <div className="h-px bg-n-3/20 my-2 lg:block hidden" />

        <button
          onClick={onLogout}
          className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-50 w-full"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
