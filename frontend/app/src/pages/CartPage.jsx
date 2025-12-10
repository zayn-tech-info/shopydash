import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Store,
  MapPin,
  Dot,
  MessageCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { motion } from "framer-motion";
import CheckoutModal from "../components/cart/CheckoutModal";
import { openWhatsApp } from "../utils/whatsappUtils";
import { useClientProfileStore } from "../store/clientProfileStore";

const CartPage = () => {
  const {
    cart,
    isLoading,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCart,
  } = useCartStore();
  const { authUser } = useAuthStore();
  const { clientProfile, getProfile } = useClientProfileStore();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    if (authUser && authUser.username && !clientProfile) {
      getProfile(authUser.username, { silent: true });
    }
  }, [authUser, clientProfile, getProfile]);

  useEffect(() => {
    getCart();
  }, [getCart]);

  const getGroupedItems = () => {
    const groups = {};
    cart.forEach((item) => {
      const vendorId = item.vendorId?._id;
      if (!vendorId) return;
      if (!groups[vendorId]) {
        groups[vendorId] = {
          vendor: item.vendorId,
          items: [],
          total: 0,
        };
      }
      groups[vendorId].items.push(item);
      groups[vendorId].total += item.price * item.quantity;
    });
    return groups;
  };

  const handleCheckout = () => {
    const groups = getGroupedItems();
    setGroupedItems(groups);
    const vendorIds = Object.keys(groups);

    if (vendorIds.length === 0) return;
    if (vendorIds.length === 1) {
      const group = groups[vendorIds[0]];
      openWhatsApp(
        group.vendor,
        group.items,
        group.total,
        authUser,
        clientProfile
      );
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const total = subtotal;

  if (isLoading && cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-3"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary-1/20 p-6 rounded-full inline-block mb-6">
            <ShoppingBag size={64} className="text-primary-3" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            Looks like you haven't added anything to your cart yet. Explore our
            vendors to find amazing products!
          </p>
          <Link
            to="/home"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary-3 text-white font-semibold rounded-xl hover:bg-primary-4 transition-all duration-300 shadow-lg shadow-primary-3/30"
          >
            Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Shopping Cart ({getCartCount()} items)
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {cart.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  key={item._id || item.productId} // Fallback key
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6 relative overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="w-full h-48 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center my-1 text-gray-500 gap-x-2 gap-y-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Store size={14} className="mr-1" />
                              <span>
                                {item.vendorId?.businessName || "Vendor"}
                              </span>
                            </div>
                            <Dot className="hidden sm:block" />
                            <div>
                              <p className="text-xs text-gray-400 mt-1 sm:mt-0">
                                {item.school}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-primary-3 gap-2 mt-1">
                            <MapPin size={14} />
                            <p className="text-xs ">{item.location}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors text-gray-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors text-gray-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-3">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    Includes taxes and fees
                  </p>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-8 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <MessageCircle size={20} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <ShoppingBag size={16} />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        groupedItems={groupedItems}
        authUser={authUser}
        userProfile={clientProfile}
      />
    </div>
  );
};
export default CartPage;
