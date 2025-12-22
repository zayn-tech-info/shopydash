import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
import {
  Package,
  Clock,
  CheckCircle,
  MapPin,
  ExternalLink,
  Loader,
} from "lucide-react";

export default function OrderList() {
  const { orders, isLoading, fetchOrders, markOrderDelivered } =
    useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleMarkDelivered = (orderId) => {
    markOrderDelivered(orderId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">You haven't bought anything yet.</p>
        <Link
          to="/feeds"
          className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package /> My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-wide">
                      Ref: {order.transactionReference?.split("_")[1]}
                    </span>
                    <h3 className="text-sm text-gray-500">
                      Vendor:{" "}
                      <span className="font-medium text-gray-900">
                        {order.vendor?.storeName || "Vendor"}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={order.deliveryStatus}
                      type="delivery"
                    />
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-md bg-gray-200"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="text-lg font-bold text-gray-900">
                    Total: ₦{order.totalAmount.toLocaleString()}
                  </div>

                  {order.deliveryStatus === "pending" &&
                    order.paymentStatus === "paid" && (
                      <button
                        onClick={() => handleMarkDelivered(order._id)}
                        className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle size={18} /> Confirm Delivery for Payout
                      </button>
                    )}

                  {order.deliveryStatus === "delivered" && (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle size={16} /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const StatusBadge = ({ status, type }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    delivered: "bg-blue-100 text-blue-800",
    held: "bg-purple-100 text-purple-800",
    released: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};
