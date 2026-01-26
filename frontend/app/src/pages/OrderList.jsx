import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import ConfirmationModal from "../components/common/ConfirmationModal";
import ReviewModal from "../components/common/ReviewModal";
import { useReviewStore } from "../store/reviewStore";
import { toast } from "react-hot-toast";
import useChatStore from "../store/chatStore";
import {
  Package,
  CheckCircle,
  Loader,
  Clock,
  ShoppingBag,
  Store,
  User,
  Filter,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderList({ isEmbedded = false, role = "client" }) {
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
  const [filterStatus, setFilterStatus] = useState("all");
  const isVendor = role === "vendor";

  useEffect(() => {
    fetchOrders(role);
  }, [fetchOrders, role]);

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

  
  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "completed")
      return order.deliveryStatus === "delivered";
    if (filterStatus === "incomplete")
      return order.deliveryStatus !== "delivered";
    return true;
  });

  if (isLoading) {
    return (
      <div
        className={`${
          isEmbedded ? "h-full py-12" : "min-h-screen"
        } flex items-center justify-center bg-gray-50`}
      >
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
      <div
        className={`${
          isEmbedded ? "h-full" : "min-h-[80vh]"
        } flex flex-col items-center justify-center p-4 text-center bg-gray-50`}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100"
        >
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          {isVendor
            ? "You haven't received any orders yet. Keep promoting your products!"
            : "Looks like you haven't made any purchases yet. Explore our feed to find something you love!"}
        </p>
        {!isVendor && (
          <Link
            to="/feeds"
            className="px-8 py-3 bg-primary-3 text-white rounded-full font-semibold shadow-lg shadow-primary-3/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Shopping
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${
        isEmbedded ? "" : "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      }`}
    >
      <div className={`${isEmbedded ? "" : "max-w-4xl mx-auto"}`}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-primary-3" size={32} />
            {isVendor ? "Incoming Orders" : "My Orders"}
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            {isVendor
              ? "Manage and fulfill orders from your customers"
              : "Track and manage your recent purchases"}
          </p>
        </header>

        {}
        <div className="mb-6 flex items-center gap-3">
          <Filter className="text-gray-400" size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-3 focus:border-transparent transition-all cursor-pointer hover:border-gray-300"
          >
            <option value="all">All Orders</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <span className=" border-gray-800 border px-6 py-2 font-medium text-sm text-gray-500 rounded-xl">
            {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "order" : "orders"}
          </span>
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order._id}
                order={order}
                index={index}
                isVendor={isVendor}
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

function OrderCard({ order, index, onConfirmDelivery, isVendor }) {
  const navigate = useNavigate();
  const { checkAccess, fetchMessages, addConversation } = useChatStore();
  const isDelivered = order.deliveryStatus === "delivered";
  const canConfirm =
    !isVendor &&
    order.deliveryStatus === "pending" &&
    order.paymentStatus === "paid";

  const handleMessageBuyer = async () => {
    if (!order.buyer?._id) {
      toast.error("Buyer information not available");
      return;
    }

    try {
      const result = await checkAccess(order.buyer._id);
      if (result.allowed && result.conversation) {
        addConversation(result.conversation);
        await fetchMessages(result.conversation._id);
        navigate("/messages");
      }
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm flex-shrink-0">
              {isVendor ? (
                order.buyer?.profilePic ? (
                  <img
                    src={order.buyer.profilePic}
                    alt={order.buyer.fullName || "Buyer"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-3 text-white font-bold">
                    {(
                      order.buyer?.fullName?.[0] ||
                      order.buyer?.username?.[0] ||
                      "?"
                    ).toUpperCase()}
                  </div>
                )
              ) : order.vendor?.userId?.profilePic ? (
                <img
                  src={order.vendor.userId.profilePic}
                  alt={order.vendor.userId.businessName || "Vendor"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-3 text-white font-bold">
                  {(
                    order.vendor?.userId?.businessName?.[0] ||
                    order.vendor?.storeUsername?.[0] ||
                    "?"
                  ).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                {isVendor ? "Buyer" : "Vendor"}
              </p>
              <h3 className="font-bold text-gray-900 text-base">
                {isVendor
                  ? order.buyer?.fullName ||
                    order.buyer?.username ||
                    order.buyer?.email ||
                    "Guest Buyer"
                  : order.vendor?.userId?.businessName ||
                    order.vendor?.storeUsername ||
                    order.vendor?.userId?.fullName ||
                    "Unknown Vendor"}
              </h3>
              {isVendor &&
                (order.buyer?.phoneNumber || order.buyer?.whatsAppNumber) && (
                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                    <span>📞</span>
                    <span>
                      {order.buyer?.phoneNumber || order.buyer?.whatsAppNumber}
                    </span>
                  </p>
                )}
            </div>
          </div>

          {}
          {isVendor && order.buyer?._id && (
            <button
              onClick={handleMessageBuyer}
              className="px-4 py-2 bg-primary-3 text-white rounded-lg font-medium shadow-sm hover:bg-primary-3/90 transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">Message</span>
            </button>
          )}
        </div>

        {}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <p className="text-xs bg-white px-3 py-1.5 rounded-lg font-mono border border-gray-200">
              {order.transactionReference || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.paymentStatus} type="payment" />
            <StatusBadge status={order.deliveryStatus} type="delivery" />
          </div>
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

            {!canConfirm && !isDelivered && !isVendor && (
              <div className="text-sm text-gray-400 italic flex items-center gap-2">
                <Clock size={16} /> Awaiting Delivery
              </div>
            )}

            {isVendor && !isDelivered && (
              <div className="text-sm text-gray-500 italic">
                Wait for buyer confirmation to receive funds
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
