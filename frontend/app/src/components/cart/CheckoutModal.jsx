import { useState } from "react";
import { motion } from "framer-motion";
import { X, CreditCard, Lock, MapPin } from "lucide-react";
import { api } from "../../lib/axios";
import { toast } from "react-hot-toast";

const CheckoutModal = ({
  isOpen,
  onClose,
  groupedItems,
  authUser,
  userProfile,
}) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(userProfile?.address || "");

  if (!isOpen) return null;

  // Flatten items for API and calculate Grand Total
  const allItems = Object.values(groupedItems).flatMap((g) => g.items);
  const grandTotal = Object.values(groupedItems).reduce(
    (acc, g) => acc + g.total,
    0
  );

  const handlePayment = async () => {
    if (!address) {
      toast.error("Please enter a delivery address");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        cartItems: allItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        deliveryAddress: address,
      };

      const res = await api.post("/api/v1/payment/initialize-order", payload);

      if (res.data.success && res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" />
            Secure Checkout
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Delivery Address
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Block A, Room 10, Hostel B..."
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-3 border resize-none h-10 outline-0"
              required
            />
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <span className="flex-grow h-px bg-gray-100"></span>
              Order Summary
              <span className="flex-grow h-px bg-gray-100"></span>
            </h4>

            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-4">
              {Object.values(groupedItems).map((group) => (
                <div
                  key={group.vendor?._id}
                  className="pb-4 last:pb-0 border-b last:border-0 border-dashed border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-3 text-gray-900">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                      {group.vendor?.businessName?.charAt(0) || "V"}
                    </div>
                    <span className="font-semibold text-sm">
                      {group.vendor?.businessName || "Vendor"}
                    </span>
                  </div>

                  <div className="space-y-2.5 pl-8">
                    {group.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center text-sm group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-xs font-medium text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-100 min-w-[24px] text-center">
                            {item.quantity}x
                          </span>
                          <span className="text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap pl-2">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10 relative">
          <div className="flex justify-between items-end mb-6">
            <div className="text-sm text-gray-500 font-medium">
              Total Amount
            </div>
            <div className="text-3xl font-bold text-gray-900 leading-none">
              <span className="text-lg text-gray-500 font-normal align-top mr-0.5">
                ₦
              </span>
              {grandTotal.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Pay Now</span>
                <CreditCard className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            <Lock className="w-3 h-3 text-green-500" />
            Secured by Paystack
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
