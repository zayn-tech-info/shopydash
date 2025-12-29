import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import CheckoutModal from "../components/cart/CheckoutModal";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Store,
  Loader,
} from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, getCart, removeFromCart, updateQuantity } =
    useCartStore();
  const { authUser } = useAuthStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    getCart();
  }, [getCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const groupedItems = cart.reduce((acc, item) => {
    const vendor = item.vendorId || {
      _id: "unknown",
      businessName: "Unknown Vendor",
    };
    const vendorId = vendor._id;

    if (!acc[vendorId]) {
      acc[vendorId] = {
        vendor: vendor,
        items: [],
        total: 0,
      };
    }

    acc[vendorId].items.push({
      ...item,
      title: item.title,
      price: item.price,
      image: item.image,
      productId: item.productId,
    });

    acc[vendorId].total += (item.price || 0) * item.quantity;

    return acc;
  }, {});

  const totalAmount = Object.values(groupedItems).reduce(
    (acc, group) => acc + group.total,
    0
  );

  const handleCheckout = () => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    setIsCheckoutOpen(true);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh]''''''''' flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. content.
        </p>
        <Link
          to="/feeds"
          className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          Shopping Cart
          <span className="text-base font-normal text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
            {cart.length} items
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {}
          <div className="lg:col-span-8 space-y-8">
            {Object.values(groupedItems).map((group) => (
              <div
                key={group.vendor?._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-lg border border-orange-100">
                      {group.vendor?.businessName?.charAt(0) || "V"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {group.vendor?.businessName || "Vendor"}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Verified Vendor
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-50">
                  {group.items.map((item) => (
                    <div
                      key={item._id || item.productId}
                      className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-colors group"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full sm:w-32 h-32 object-cover rounded-2xl bg-gray-100 border border-gray-100 shadow-sm"
                      />

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-orange-600 font-bold text-xl">
                              ₦{item.price?.toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-1.5 border border-gray-100">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-orange-600 disabled:opacity-50 transition-all active:scale-95 border border-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-base font-bold w-6 text-center text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-orange-600 transition-all active:scale-95 border border-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <p className="text-sm font-medium text-gray-500">
                            Subtotal:{" "}
                            <span className="text-gray-900">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm shadow-gray-100/50 border border-gray-100 p-8 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-6 text-xl">
                Order Summary
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-gray-600 text-base">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-600 text-base">
                  <span>Delivery</span>
                  <span className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-gray-900 text-lg">Total</span>
                  <span className="text-3xl font-extrabold text-orange-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-right">
                  Including taxes and fees
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-widest">
                <Store size={14} className="text-green-500" />
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        groupedItems={groupedItems}
        authUser={authUser}
        userProfile={authUser}
      />
    </div>
  );
}
