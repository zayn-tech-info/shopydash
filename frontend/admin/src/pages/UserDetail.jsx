import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDate, formatCurrency, capitalize } from "../utils/formatters";
import { Card, CardContent, Button, Skeleton } from "@mui/material";
import { ArrowLeft, Ban, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: data, loading, fetchUserDetail, toggleBanUser } = useUserStore();

  const [banDialog, setBanDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserDetail(id);
  }, [id, fetchUserDetail]);

  const handleBanToggle = async (reason) => {
    setActionLoading(true);
    try {
      const isBanned = data?.user?.isBanned;
      await toggleBanUser(id, !isBanned, reason);
      toast.success(isBanned ? "User unbanned" : "User banned");
      fetchUserDetail(id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
    setActionLoading(false);
    setBanDialog(false);
  };

  const user = data?.user;

  if (loading || !user) {
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
          onClick={() => navigate("/users")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600">
              {user.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.fullName}
            </h1>
            <p className="text-sm text-gray-500">
              @{user.username || "—"} · {capitalize(user.role)}
            </p>
          </div>
        </div>

        {user.role !== "admin" && (
          <Button
            variant="outlined"
            color={user.isBanned ? "success" : "error"}
            size="small"
            startIcon={user.isBanned ? <CheckCircle size={16} /> : <Ban size={16} />}
            onClick={() => setBanDialog(true)}
          >
            {user.isBanned ? "Unban" : "Ban User"}
          </Button>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Account Info
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Email:</span> {user.email}</p>
              <p><span className="text-gray-500">Phone:</span> {user.phoneNumber || "—"}</p>
              <p><span className="text-gray-500">Role:</span> {capitalize(user.role)}</p>
              <p>
                <span className="text-gray-500">Verified:</span>{" "}
                <StatusBadge status={user.isVerified ? "true" : "false"} />
              </p>
              <p>
                <span className="text-gray-500">Banned:</span>{" "}
                {user.isBanned ? (
                  <StatusBadge status="suspended" />
                ) : (
                  "No"
                )}
              </p>
              {user.banReason && (
                <p><span className="text-gray-500">Ban Reason:</span> {user.banReason}</p>
              )}
              <p><span className="text-gray-500">Joined:</span> {formatDate(user.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Location & School
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">School:</span> {user.schoolName || "—"}</p>
              <p><span className="text-gray-500">School email:</span> {user.schoolEmail || "—"}</p>
              <p><span className="text-gray-500">State:</span> {user.state || "—"}</p>
              <p><span className="text-gray-500">City:</span> {user.city || "—"}</p>
              <p><span className="text-gray-500">Area:</span> {user.schoolArea || "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Profile Link */}
      {data.vendorProfile && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", mb: 3 }}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Vendor Profile
                </h3>
                <p className="text-sm mt-1">
                  {data.vendorProfile.userId?.username || data.vendorProfile.userId?.businessName || "Store"} ·{" "}
                  <StatusBadge status={data.vendorProfile.activeStatus || data.vendorProfile.status} />
                </p>
              </div>
              <Button
                size="small"
                onClick={() => navigate(`/vendors/${data.vendorProfile._id}`)}
              >
                View Vendor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      {data.recentOrders?.length > 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Recent Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Payment</th>
                    <th className="pb-2">Delivery</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
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

      <ConfirmDialog
        open={banDialog}
        title={user.isBanned ? "Unban User" : "Ban User"}
        message={
          user.isBanned
            ? `Unban ${user.fullName}? They will regain access to the platform.`
            : `Ban ${user.fullName}? They will be unable to use the platform.`
        }
        confirmText={user.isBanned ? "Unban" : "Ban"}
        confirmColor={user.isBanned ? "success" : "error"}
        showReason={!user.isBanned}
        onConfirm={handleBanToggle}
        onCancel={() => setBanDialog(false)}
        loading={actionLoading}
      />
    </div>
  );
}
