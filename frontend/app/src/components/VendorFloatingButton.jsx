import { Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const VendorFloatingButton = () => {
  const { authUser } = useAuthStore();
  const location = useLocation();

  if (location.pathname === "/vendor/add") return null;

  if (!authUser || authUser.role !== "vendor") return null;

  return (
    <Link
      to="/vendor/add"
      className="fixed bottom-20 right-4 md:bottom-10 md:right-10 bg-[#F7561B] hover:bg-[#d94a16] text-white w-14 h-14 rounded-full shadow-lg transition-all z-50 flex items-center justify-center hover:scale-110 active:scale-95"
      aria-label="Create Post"
    >
      <Plus size={28} strokeWidth={2.5} />
    </Link>
  );
};
