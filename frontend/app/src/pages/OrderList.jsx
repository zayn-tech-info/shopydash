import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import ConfirmationModal from "../components/common/ConfirmationModal";
import ReviewModal from "../components/common/ReviewModal";
import { useReviewStore } from "../store/reviewStore";
import { toast } from "react-hot-toast";
import {
  Package,
  CheckCircle,
  Loader,
  Clock,
  ShoppingBag,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderList() {
  const {
    orders,
    isLoading,
    fetchOrders,
    markOrderDelivered,
    isMarkingDelivered,
  } = useOrderStore();

  const { createReview } = useReviewStore();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleMarkDeliveredClick = (orderId) => {
    setSelectedOrderId(orderId);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelivery = async () => {
    if (selectedOrderId) {
      await markOrderDelivered(selectedOrderId);
      setConfirmModalOpen(false);

      const order = orders.find((o) => o._id === selectedOrderId);
      if (order) {
        setReviewOrder(order);
        setIsReviewModalOpen(true);
      }

      setSelectedOrderId(null);
    }
  };

  const handleReviewSubmit = async (data) => {
    try {
      await createReview(data);
      toast.success("Review submitted! Thank you.");
      setIsReviewModalOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-primary-3" />
        </motion.div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100"
        >
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't made any purchases yet. Explore our feed to
          find something you love!
        </p>
        <Link
          to="/feeds"
          className="px-8 py-3 bg-primary-3 text-white rounded-full font-semibold shadow-lg shadow-primary-3/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-primary-3" size={32} />
            My Orders
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            Track and manage your recent purchases
          </p>
        </header>

        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order, index) => (
              <OrderCard
                key={order._id}
                order={order}
                index={index}
                onConfirmDelivery={() => handleMarkDeliveredClick(order._id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmDelivery}
        title="Confirm Delivery"
        message="Are you sure you have received this item? Confirming delivery will release the funds to the vendor. This action cannot be undone."
        confirmText="Yes, Release Funds"
        cancelText="Not yet"
        isLoading={isMarkingDelivered}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        order={reviewOrder}
      />
    </div>
  );
}

function OrderCard({ order, index, onConfirmDelivery }) {
  const isDelivered = order.deliveryStatus === "delivered";
  const canConfirm =
    order.deliveryStatus === "pending" && order.paymentStatus === "paid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
            <Store className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
              Vendor
            </p>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
              {order.vendor?.userId?.businessName ||
                order.vendor?.storeUsername ||
                order.vendor?.userId?.fullName ||
                "Unknown Vendor"}
            </h3>
          </div>
        </div>
        <div>
          <p className="text-xs bg-gray-200 px-3 py-1 rounded-md font-mono mb-0.5">
            REF: {order.transactionReference || "N/A"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden sm:block">
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <StatusBadge status={order.paymentStatus} type="payment" />
          <StatusBadge status={order.deliveryStatus} type="delivery" />
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start p-2 rounded-xl border border-transparent"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1">
                  {item.title}
                </h4>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-primary-3 font-semibold">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              ₦{order.totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="w-full sm:w-auto">
            {canConfirm && (
              <button
                onClick={onConfirmDelivery}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 active:bg-green-700 text-white rounded-xl font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Confirm Delivery
              </button>
            )}

            {isDelivered && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-100">
                <CheckCircle size={18} />
                <span className="font-medium">Order Completed</span>
              </div>
            )}

            {!canConfirm && !isDelivered && (
              <div className="text-sm text-gray-400 italic flex items-center gap-2">
                <Clock size={16} /> Awaiting Delivery
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const StatusBadge = ({ status, type }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    delivered: "bg-blue-100 text-blue-700 border-blue-200",
    held: "bg-purple-100 text-purple-700 border-purple-200",
    released: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
        styles[status] || "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
};
