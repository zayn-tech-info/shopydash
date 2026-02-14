import { useEffect, useState, useCallback } from "react";
import useActivityLogStore from "../stores/activityLogStore";
import DataTable from "../components/DataTable";
import { formatDateTime, capitalize } from "../utils/formatters";

const actionLabels = {
  vendor_suspended: "Vendor Suspended",
  vendor_activated: "Vendor Activated",
  vendor_approved: "Vendor Approved",
  vendor_kyc_approved: "KYC Approved",
  vendor_kyc_rejected: "KYC Rejected",
  user_banned: "User Banned",
  user_unbanned: "User Unbanned",
  user_role_changed: "Role Changed",
  order_cancelled: "Order Cancelled",
  order_status_updated: "Order Updated",
  refund_issued: "Refund Issued",
  subscription_activated: "Sub Activated",
  subscription_cancelled: "Sub Cancelled",
  subscription_changed: "Sub Changed",
  review_deleted: "Review Deleted",
  settings_changed: "Settings Changed",
};

export default function ActivityLogs() {
  const { logs, pagination, loading, fetchLogs } = useActivityLogStore();

  const [filters, setFilters] = useState({ action: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  const loadLogs = useCallback(() => {
    fetchLogs({
      page,
      limit,
      action: filters.action || undefined,
    });
  }, [page, limit, filters, fetchLogs]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const columns = [
    {
      id: "actor",
      label: "Admin",
      render: (row) => row.actor?.fullName || row.actor?.email || "System",
    },
    {
      id: "action",
      label: "Action",
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {actionLabels[row.action] || capitalize(row.action)}
        </span>
      ),
    },
    {
      id: "targetType",
      label: "Target",
      render: (row) => capitalize(row.targetType),
    },
    {
      id: "details",
      label: "Details",
      render: (row) => (
        <span className="text-sm text-gray-600 max-w-xs truncate block">
          {row.details || "—"}
        </span>
      ),
    },
    {
      id: "createdAt",
      label: "Timestamp",
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  const actionOptions = Object.entries(actionLabels).map(([value, label]) => ({
    value,
    label,
  }));

  const tableFilters = [
    {
      id: "action",
      label: "Action",
      value: filters.action,
      options: actionOptions,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-sm text-gray-500 mt-1">
          Audit trail of all admin actions
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={logs}
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
    </div>
  );
}
