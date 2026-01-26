import { createPortal } from "react-dom";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        {}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        <div className="p-4 bg-gray-50/50 flex gap-3 justify-end border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
