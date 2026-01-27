import { X, LogIn, UserPlus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuthStore } from "../../store/authStore";

export default function AuthRequiredModal({
  isOpen,
  onClose,
  title = "Login Required",
  message = "You need to be logged in to proceed with checkout. Create an account or login to complete your purchase.",
  cancelText = "Continue Shopping",
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-n-8/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-n-2 rounded-full transition-colors text-n-5"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary-3/10 rounded-full flex items-center justify-center text-primary-3 mb-6">
            <ShoppingBag size={32} />
          </div>

          <h3 className="text-2xl font-bold text-n-8 mb-2">{title}</h3>
          <p className="text-n-4 mb-8">{message}</p>

          <div className="flex flex-col gap-3 w-full">
            <Link
              to="/login"
              className="w-full py-3.5 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-3/90 transition-colors shadow-lg shadow-primary-3/20 flex items-center justify-center gap-2"
            >
              <LogIn size={20} /> Login
            </Link>
            <Link
              to="/signup"
              className="w-full py-3.5 bg-white text-n-8 border border-n-3 rounded-xl font-bold hover:bg-n-2 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={20} /> Create Account
            </Link>
          </div>

          <button
            onClick={onClose}
            className="mt-6 text-sm text-n-5 hover:text-n-8 font-medium transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
