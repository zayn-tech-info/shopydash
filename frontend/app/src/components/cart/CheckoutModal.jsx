import { motion } from "framer-motion";
import { X, MessageCircle, ExternalLink } from "lucide-react";
import { openWhatsApp } from "../../utils/whatsappUtils";

const CheckoutModal = ({ isOpen, onClose, groupedItems, authUser }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900">
            Checkout from Vendors
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <p className="text-gray-500 text-sm mb-4">
            You have items from different vendors. Please send your orders to
            each vendor separately via WhatsApp.
          </p>

          {Object.values(groupedItems).map((group) => (
            <div
              key={group.vendor?._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={
                    group.vendor?.profilePic || "https://via.placeholder.com/40"
                  }
                  alt={group.vendor?.businessName}
                  className="w-10 h-10 rounded-full object-cover bg-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">
                    {group.vendor?.businessName}
                  </h4>
                  <div className="flex items-center text-xs text-green-600">
                    <MessageCircle size={12} className="mr-1" />
                    <span>Available on WhatsApp</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 mb-4 pl-13">
                {group.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span className="truncate max-w-[180px]">
                      {item.quantity}x {item.title}
                    </span>
                    <span className="font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>₦{group.total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() =>
                  openWhatsApp(group.vendor, group.items, group.total, authUser)
                }
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Send Order to Vendor</span>
                <ExternalLink size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
