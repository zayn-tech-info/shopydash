import { Chip } from "@mui/material";

const statusConfig = {
  // Vendor / user status
  active: { color: "success", label: "Active" },
  suspended: { color: "error", label: "Suspended" },
  pending: { color: "warning", label: "Pending" },

  // KYC
  verified: { color: "success", label: "Verified" },
  failed: { color: "error", label: "Failed" },
  none: { color: "default", label: "None" },

  // Payment
  paid: { color: "success", label: "Paid" },
  refunded: { color: "info", label: "Refunded" },
  success: { color: "success", label: "Success" },

  // Delivery
  delivered: { color: "success", label: "Delivered" },
  cancelled: { color: "error", label: "Cancelled" },

  // Payout
  held: { color: "warning", label: "Held" },
  released: { color: "success", label: "Released" },

  // Subscription
  expired: { color: "error", label: "Expired" },

  // Generic
  true: { color: "success", label: "Yes" },
  false: { color: "error", label: "No" },
};

export default function StatusBadge({ status, size = "small" }) {
  const key = String(status).toLowerCase();
  const config = statusConfig[key] || {
    color: "default",
    label: status || "Unknown",
  };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      variant="outlined"
      sx={{ fontWeight: 600, fontSize: "0.75rem" }}
    />
  );
}
