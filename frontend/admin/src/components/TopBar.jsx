import { LogOut, Menu } from "lucide-react";
import useAuthStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export default function TopBar({ onMenuToggle }) {
  const { admin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
          Admin Panel
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {admin && (
          <span className="text-sm text-gray-600 hidden sm:block">
            {admin.fullName || admin.email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
