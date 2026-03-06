import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useVendorStore from "../stores/vendorStore";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDate, formatCurrency } from "../utils/formatters";
import {
  Card,
  CardContent,
  Button,
  Skeleton,
  Chip,
} from "@mui/material";
import { ArrowLeft, Ban, CheckCircle, ShieldCheck, ShieldX } from "lucide-react";
import toast from "react-hot-toast";

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vendor, loading, fetchVendorDetail, updateVendorStatus, updateVendorKyc } =
    useVendorStore();

  const [dialog, setDialog] = useState({ open: false, type: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchVendorDetail(id);
  }, [id, fetchVendorDetail]);

  const handleAction = async (reason) => {
    setActionLoading(true);
    try {
      if (dialog.type === "suspend") {
        await updateVendorStatus(id, "suspended", reason);
        toast.success("Vendor suspended");
      } else if (dialog.type === "activate") {
        await updateVendorStatus(id, "active", reason);
        toast.success("Vendor activated");
      } else if (dialog.type === "approveKyc") {
        await updateVendorKyc(id, "verified");
        toast.success("KYC approved");
      } else if (dialog.type === "rejectKyc") {
        await updateVendorKyc(id, "failed");
        toast.success("KYC rejected");
      }
      fetchVendorDetail(id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
    setActionLoading(false);
    setDialog({ open: false, type: null });
  };

  const v = vendor?.vendor;
  const user = v?.userId;

  if (loading || !v) {
    return (
      <div className="space-y-4">
        <Skeleton height={48} width={200} />
        <Skeleton height={200} variant="rounded" />
        <Skeleton height={200} variant="rounded" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/vendors")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.businessName || user?.username || "Vendor"}
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={v.activeStatus || v.status} />
          <StatusBadge status={v.kycStatus} />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(v.activeStatus || v.status) === "active" ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Ban size={16} />}
            onClick={() =>
              setDialog({ open: true, type: "suspend" })
            }
          >
            Suspend
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="success"
            size="small"
            startIcon={<CheckCircle size={16} />}
            onClick={() =>
              setDialog({ open: true, type: "activate" })
            }
          >
            Activate
          </Button>
        )}
        {v.kycStatus === "pending" && (
          <>
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<ShieldCheck size={16} />}
              onClick={() =>
                setDialog({ open: true, type: "approveKyc" })
              }
            >
              Approve KYC
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<ShieldX size={16} />}
              onClick={() =>
                setDialog({ open: true, type: "rejectKyc" })
              }
            >
              Reject KYC
            </Button>
          </>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Owner Details
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {user?.fullName}</p>
              <p><span className="text-gray-500">Email:</span> {user?.email}</p>
              <p><span className="text-gray-500">Phone:</span> {user?.phoneNumber || "—"}</p>
              <p><span className="text-gray-500">Joined:</span> {formatDate(user?.createdAt)}</p>
              <p><span className="text-gray-500">Verified:</span> {user?.isVerified ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Store Info
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Username:</span> {user?.username || "—"}</p>
              <p><span className="text-gray-500">Rating:</span> {v.rating || 0} ({v.numReviews || 0} reviews)</p>
              <p><span className="text-gray-500">Total Sales:</span> {v.totalSales || 0}</p>
              <p><span className="text-gray-500">Delivery:</span> {v.offersDelivery ? "Yes" : "No"}</p>
              <p>
                <span className="text-gray-500">Categories:</span>{" "}
                {v.businessCategory?.length > 0
                  ? v.businessCategory.map((c) => (
                      <Chip key={c} label={c} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Subscription
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-500">Plan:</span>{" "}
                {user?.isSubscriptionActive ? user.subscriptionPlan : "Free"}
              </p>
              <p>
                <span className="text-gray-500">Status:</span>{" "}
                <StatusBadge status={user?.isSubscriptionActive ? "active" : "expired"} />
              </p>
              <p>
                <span className="text-gray-500">Expires:</span>{" "}
                {formatDate(user?.subscriptionExpiresAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Location
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">City:</span> {user?.city || "—"}</p>
              <p><span className="text-gray-500">State:</span> {user?.state || "—"}</p>
              <p><span className="text-gray-500">Area:</span> {user?.schoolArea || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      {vendor.recentOrders?.length > 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Recent Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Buyer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Payment</th>
                    <th className="pb-2">Delivery</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {vendor.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      <td className="py-2">{order.buyer?.fullName || "—"}</td>
                      <td className="py-2">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-2">
                        <StatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="py-2">
                        <StatusBadge status={order.deliveryStatus} />
                      </td>
                      <td className="py-2">{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={dialog.open}
        title={
          dialog.type === "suspend"
            ? "Suspend Vendor"
            : dialog.type === "activate"
              ? "Activate Vendor"
              : dialog.type === "approveKyc"
                ? "Approve KYC"
                : "Reject KYC"
        }
        message={
          dialog.type === "suspend"
            ? "This vendor will be suspended and unable to operate. Are you sure?"
            : dialog.type === "activate"
              ? "This will restore the vendor's access."
              : dialog.type === "approveKyc"
                ? "This will verify the vendor's identity."
                : "This will reject the vendor's KYC verification."
        }
        confirmText={
          dialog.type === "suspend"
            ? "Suspend"
            : dialog.type === "activate"
              ? "Activate"
              : dialog.type === "approveKyc"
                ? "Approve"
                : "Reject"
        }
        confirmColor={
          dialog.type === "suspend" || dialog.type === "rejectKyc"
            ? "error"
            : "success"
        }
        showReason={dialog.type === "suspend"}
        onConfirm={handleAction}
        onCancel={() => setDialog({ open: false, type: null })}
        loading={actionLoading}
      />
    </div>
  );
}
