import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  ShoppingCart,
  Users,
  CreditCard,
  Crown,
  BarChart3,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/vendors", label: "Vendors", icon: Store },
  { path: "/orders", label: "Orders", icon: ShoppingCart },
  { path: "/users", label: "Users", icon: Users },
  { path: "/subscriptions", label: "Subscriptions", icon: Crown },
  { path: "/payments", label: "Payments", icon: CreditCard },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/activity-logs", label: "Activity Logs", icon: ScrollText },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function AsideBar({ collapsed, onToggle }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-100">
        {!collapsed && (
          <h1 className="text-lg font-bold text-gray-900 truncate">
            Shopydash <span className="text-indigo-600">Admin</span>
          </h1>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors ${
            collapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={20}
                className={`shrink-0 ${
                  active
                    ? "text-indigo-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Shopydash Admin v1.0
          </p>
        </div>
      )}
    </aside>
  );
}
