import { useEffect, useState, useCallback } from "react";
import usePaymentStore from "../stores/paymentStore";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import { formatDate, formatCurrency } from "../utils/formatters";
import { DollarSign, TrendingUp, XCircle, CheckCircle } from "lucide-react";

export default function Payments() {
  const {
    transactions,
    stats,
    pagination,
    loading,
    fetchTransactions,
    fetchTransactionStats,
  } = usePaymentStore();

  const [filters, setFilters] = useState({ status: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const loadData = useCallback(() => {
    fetchTransactions({
      page,
      limit,
      status: filters.status || undefined,
    });
  }, [page, limit, filters, fetchTransactions]);

  useEffect(() => {
    loadData();
    fetchTransactionStats();
  }, [loadData, fetchTransactionStats]);

  const columns = [
    {
      id: "reference",
      label: "Reference",
      render: (row) => (
        <span className="font-mono text-xs">{row.reference}</span>
      ),
    },
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
    {
      id: "amount",
      label: "Amount",
      render: (row) => formatCurrency(row.amount),
    },
    { id: "plan", label: "Plan" },
    {
      id: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "gatewayResponse",
      label: "Gateway",
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.gatewayResponse || "—"}
        </span>
      ),
    },
    {
      id: "paidAt",
      label: "Paid At",
      render: (row) => formatDate(row.paidAt),
    },
  ];

  const tableFilters = [
    {
      id: "status",
      label: "Status",
      value: filters.status,
      options: [
        { value: "success", label: "Success" },
        { value: "failed", label: "Failed" },
        { value: "pending", label: "Pending" },
        { value: "abandoned", label: "Abandoned" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Transaction history and revenue tracking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue)}
          icon={DollarSign}
          color="#10b981"
          index={0}
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats?.todayRevenue)}
          icon={TrendingUp}
          color="#6366f1"
          index={1}
        />
        <StatCard
          title="Commission Earned"
          value={formatCurrency(stats?.totalCommission)}
          icon={CheckCircle}
          color="#a855f7"
          index={2}
        />
        <StatCard
          title="Failed Payments"
          value={stats?.failedCount || 0}
          icon={XCircle}
          color="#ef4444"
          index={3}
        />
      </div>

      <DataTable
        columns={columns}
        rows={transactions}
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
