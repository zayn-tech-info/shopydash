import {
  User,
  Shield,
  CreditCard,
  Store,
  Bell,
  Info,
  LogOut,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function SettingsSidebar({ activeTab, setActiveTab, role, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

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
    menuItems.splice(4, 0, {
      id: "payout",
      label: "Payout Settings",
      icon: CreditCard,
    });
  }

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      <div className="w-full lg:w-64 flex-shrink-0 bg-white lg:rounded-2xl border border-n-3/20 shadow-sm overflow-hidden h-fit">
        {/* Mobile Header */}
        <div className="p-4 border-b border-n-3/20 flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-bold text-n-8">Settings</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -mr-2 text-n-6 hover:text-primary-3 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Desktop Title */}
        <div className="p-4 border-b border-n-3/20 lg:block hidden">
          <h2 className="text-lg font-bold text-n-8">Settings</h2>
        </div>

        {/* Sidebar Content (Drawer on Mobile / Static on Desktop) */}
        <div
          className={`
            fixed inset-0 z-50 bg-white p-4 transition-transform duration-300 ease-in-out lg:static lg:p-3 lg:bg-transparent lg:block lg:transform-none
            ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-n-8">Settings Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-n-6 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
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

            <div className="h-px bg-n-3/20 my-2" />

            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-red-500 hover:bg-red-50 w-full text-left"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
