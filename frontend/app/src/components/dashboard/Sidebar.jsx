import { memo } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  X,
  ChevronLeft,
} from "lucide-react";

const navItems = [
  {
    id: "overview",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
];

function SidebarComponent({ activeTab, onTabChange, isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
         fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:top-0 lg:h-[calc(100vh-0px)]
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full md:-my-7">
          <div className="flex items-start justify-between p-4 border-b border-gray-100">
            <div className="flex items-center mt-10 gap-2 justify-between">
              <div className="w-8 h-8 bg-primary-3 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 up font-sans">Vendor Panel</span>
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-3 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 text-center">
              © 2026 Shopydash
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export const Sidebar = memo(SidebarComponent);
