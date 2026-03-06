import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useOrderStore from "../stores/orderStore";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDate, formatCurrency } from "../utils/formatters";
import { Card, CardContent, Button, Skeleton } from "@mui/material";
import { ArrowLeft, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading, fetchOrderDetail, cancelOrder } = useOrderStore();

  const [cancelDialog, setCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetail(id);
  }, [id, fetchOrderDetail]);

  const handleCancel = async (reason) => {
    setActionLoading(true);
    try {
      await cancelOrder(id, reason);
      toast.success("Order cancelled");
      fetchOrderDetail(id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
    setActionLoading(false);
    setCancelDialog(false);
  };

  if (loading || !order) {
    return (
      <div className="space-y-4">
        <Skeleton height={48} width={200} />
        <Skeleton height={200} variant="rounded" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Order Detail</h1>
          <p className="text-xs text-gray-400 font-mono">{order._id}</p>
        </div>
        {order.deliveryStatus !== "delivered" &&
          order.deliveryStatus !== "cancelled" && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<XCircle size={16} />}
              onClick={() => setCancelDialog(true)}
            >
              Cancel Order
            </Button>
          )}
      </div>

      {/* Status Strip */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Payment:</span>
          <StatusBadge status={order.paymentStatus} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Delivery:</span>
          <StatusBadge status={order.deliveryStatus} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Payout:</span>
          <StatusBadge status={order.payoutStatus} />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Amounts
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Total:</span>{" "}
                <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
              </p>
              <p>
                <span className="text-gray-500">Platform Fee (5%):</span>{" "}
                {formatCurrency(order.platformFee)}
              </p>
              <p>
                <span className="text-gray-500">Vendor Share:</span>{" "}
                {formatCurrency(order.vendorAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Buyer
            </h3>
            <div className="space-y-2 text-sm">
              <p>{order.buyer?.fullName || "—"}</p>
              <p className="text-gray-500">{order.buyer?.email}</p>
              <p className="text-gray-500">{order.buyer?.phoneNumber || "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Vendor
            </h3>
            <div className="space-y-2 text-sm">
              <p>{order.vendor?.userId?.businessName || order.vendor?.userId?.username || "—"}</p>
              <p className="text-gray-500">{order.vendor?.userId?.email}</p>
              <p>
                <StatusBadge status={order.vendor?.activeStatus || order.vendor?.status || "active"} />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", mb: 3 }}>
        <CardContent>
          <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Items ({order.items?.length || 0})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Delivery Address
            </h3>
            <div className="text-sm space-y-1">
              <p>{order.deliveryAddress.address}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
              <p>{order.deliveryAddress.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamp */}
      <p className="text-xs text-gray-400 mt-4">
        Created: {formatDate(order.createdAt)}
      </p>

      <ConfirmDialog
        open={cancelDialog}
        title="Cancel Order"
        message="This will cancel the order and notify the buyer. This action cannot be undone."
        confirmText="Cancel Order"
        confirmColor="error"
        showReason
        onConfirm={handleCancel}
        onCancel={() => setCancelDialog(false)}
        loading={actionLoading}
      />
    </div>
  );
}
