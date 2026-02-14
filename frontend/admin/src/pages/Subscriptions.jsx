import { useEffect, useState, useCallback } from "react";
import useSubscriptionStore from "../stores/subscriptionStore";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { formatDate, formatCurrency } from "../utils/formatters";
import { Crown, Clock, Users, DollarSign } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import toast from "react-hot-toast";

export default function Subscriptions() {
  const {
    subscriptions,
    stats,
    pagination,
    loading,
    fetchSubscriptions,
    fetchSubscriptionStats,
    activateSubscription,
    cancelSubscription,
  } = useSubscriptionStore();

  const [filters, setFilters] = useState({ plan: "", status: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [activateDialog, setActivateDialog] = useState({
    open: false,
    id: null,
  });
  const [activatePlan, setActivatePlan] = useState("Shopydash Boost");
  const [activateDays, setActivateDays] = useState(30);
  const [cancelDialog, setCancelDialog] = useState({ open: false, id: null });
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(() => {
    fetchSubscriptions({
      page,
      limit,
      plan: filters.plan || undefined,
      status: filters.status || undefined,
    });
  }, [page, limit, filters, fetchSubscriptions]);

  useEffect(() => {
    loadData();
    fetchSubscriptionStats();
  }, [loadData, fetchSubscriptionStats]);

  const handleActivate = async () => {
    setActionLoading(true);
    try {
      await activateSubscription(activateDialog.id, activatePlan, activateDays);
      toast.success("Subscription activated");
      loadData();
      fetchSubscriptionStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to activate");
    }
    setActionLoading(false);
    setActivateDialog({ open: false, id: null });
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await cancelSubscription(cancelDialog.id);
      toast.success("Subscription cancelled");
      loadData();
      fetchSubscriptionStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
    setActionLoading(false);
    setCancelDialog({ open: false, id: null });
  };

  const planCounts = {};
  stats?.planDistribution?.forEach((p) => {
    planCounts[p._id] = p.count;
  });

  const columns = [
    {
      id: "user",
      label: "User",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.user?.fullName || "—"}
          </p>
          <p className="text-xs text-gray-500">{row.user?.email}</p>
        </div>
      ),
    },
    { id: "plan", label: "Plan" },
    {
      id: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "amount",
      label: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
    {
      id: "startDate",
      label: "Start",
      render: (row) => formatDate(row.startDate),
    },
    {
      id: "endDate",
      label: "End",
      render: (row) => formatDate(row.endDate),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-1">
          {row.status !== "active" && (
            <Button
              size="small"
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                setActivateDialog({ open: true, id: row._id });
              }}
            >
              Activate
            </Button>
          )}
          {row.status === "active" && (
            <Button
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setCancelDialog({ open: true, id: row._id });
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  const tableFilters = [
    {
      id: "plan",
      label: "Plan",
      value: filters.plan,
      options: [
        { value: "Shopydash Boost", label: "Boost" },
        { value: "Shopydash Pro", label: "Pro" },
        { value: "Shopydash Max", label: "Max" },
      ],
    },
    {
      id: "status",
      label: "Status",
      value: filters.status,
      options: [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage vendor subscriptions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Active Subscriptions"
          value={stats?.totalActive || 0}
          icon={Crown}
          color="#a855f7"
          index={0}
        />
        <StatCard
          title="Expiring Soon"
          value={stats?.expiringSoon || 0}
          icon={Clock}
          color="#f59e0b"
          index={1}
        />
        <StatCard
          title="Boost"
          value={planCounts["Shopydash Boost"] || 0}
          icon={Users}
          color="#6366f1"
          index={2}
        />
        <StatCard
          title="Pro + Max"
          value={
            (planCounts["Shopydash Pro"] || 0) +
            (planCounts["Shopydash Max"] || 0)
          }
          icon={DollarSign}
          color="#10b981"
          index={3}
        />
      </div>

      <DataTable
        columns={columns}
        rows={subscriptions}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        filters={tableFilters}
        onFilterChange={(id, val) =>
          setFilters((f) => ({ ...f, [id]: val }))
        }
        loading={loading}
      />

      {/* Activate Dialog */}
      <Dialog
        open={activateDialog.open}
        onClose={() => setActivateDialog({ open: false, id: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Activate Subscription
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <FormControl fullWidth size="small">
              <InputLabel>Plan</InputLabel>
              <Select
                value={activatePlan}
                label="Plan"
                onChange={(e) => setActivatePlan(e.target.value)}
              >
                <MenuItem value="Shopydash Boost">Shopydash Boost</MenuItem>
                <MenuItem value="Shopydash Pro">Shopydash Pro</MenuItem>
                <MenuItem value="Shopydash Max">Shopydash Max</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Duration (days)"
              value={activateDays}
              onChange={(e) => setActivateDays(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setActivateDialog({ open: false, id: null })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleActivate}
            disabled={actionLoading}
          >
            {actionLoading ? "Activating..." : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={cancelDialog.open}
        title="Cancel Subscription"
        message="This will cancel the subscription and remove the user's premium features."
        confirmText="Cancel Subscription"
        confirmColor="error"
        onConfirm={handleCancel}
        onCancel={() => setCancelDialog({ open: false, id: null })}
        loading={actionLoading}
      />
    </div>
  );
}
