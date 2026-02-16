import { memo, useEffect } from "react";
import { useOrderStore } from "../../store/orderStore";
import { ShoppingCart, Package, Clock, CheckCircle, Truck } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-yellow-600 bg-yellow-50",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "text-blue-600 bg-blue-50",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-purple-600 bg-purple-50",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
  },
};

function OrderCard({ order }) {
  const { markOrderDelivered, isMarkingDelivered } = useOrderStore();
  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Order ID and Status */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-900">
              #{order._id?.slice(-8).toUpperCase()}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
            >
              <StatusIcon size={12} />
              {status.label}
            </span>
          </div>

          {/* Customer Info */}
          <p className="text-sm text-gray-600 mb-1">
            {order.buyerName || "Customer"}
          </p>

          {/* Products */}
          <div className="text-xs text-gray-500">
            {order.items?.length || 1} item(s) • ₦
            {Number(order.totalAmount || 0).toLocaleString()}
          </div>

          {/* Date */}
          <div className="mt-2 text-xs text-gray-400">
            {formatDate(order.createdAt)}
          </div>
        </div>

        {/* Action */}
        {order.status !== "delivered" && (
          <button
            onClick={() => markOrderDelivered(order._id)}
            disabled={isMarkingDelivered}
            className="px-3 py-1.5 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
}

function OrdersTabComponent() {
  const { orders, isLoading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders("vendor");
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border p-4 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
        <p className="text-sm text-gray-500">
          {orders?.length || 0} {orders?.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Orders List */}
      {!orders || orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-primary-3" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            When customers place orders, they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

export const OrdersTab = memo(OrdersTabComponent);
