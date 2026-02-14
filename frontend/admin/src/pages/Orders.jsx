import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../stores/orderStore";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { formatDate, formatCurrency, truncate } from "../utils/formatters";

export default function Orders() {
  const navigate = useNavigate();
  const { orders, pagination, loading, fetchOrders } = useOrderStore();

  const [filters, setFilters] = useState({
    paymentStatus: "",
    deliveryStatus: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const loadOrders = useCallback(() => {
    fetchOrders({
      page,
      limit,
      paymentStatus: filters.paymentStatus || undefined,
      deliveryStatus: filters.deliveryStatus || undefined,
    });
  }, [page, limit, filters, fetchOrders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const columns = [
    {
      id: "orderId",
      label: "Order ID",
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">
          {truncate(row._id, 12)}
        </span>
      ),
    },
    {
      id: "buyer",
      label: "Buyer",
      render: (row) => row.buyer?.fullName || "—",
    },
    {
      id: "vendor",
      label: "Vendor",
      render: (row) =>
        row.vendor?.userId?.businessName || row.vendor?.storeUsername || "—",
    },
    {
      id: "items",
      label: "Items",
      render: (row) => row.items?.length || 0,
    },
    {
      id: "totalAmount",
      label: "Total",
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      id: "paymentStatus",
      label: "Payment",
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      id: "deliveryStatus",
      label: "Delivery",
      render: (row) => <StatusBadge status={row.deliveryStatus} />,
    },
    {
      id: "createdAt",
      label: "Date",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const tableFilters = [
    {
      id: "paymentStatus",
      label: "Payment",
      value: filters.paymentStatus,
      options: [
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "refunded", label: "Refunded" },
      ],
    },
    {
      id: "deliveryStatus",
      label: "Delivery",
      value: filters.deliveryStatus,
      options: [
        { value: "pending", label: "Pending" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor and manage all orders
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={orders}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        onRowClick={(row) => navigate(`/orders/${row._id}`)}
        filters={tableFilters}
        onFilterChange={(id, val) =>
          setFilters((f) => ({ ...f, [id]: val }))
        }
        loading={loading}
      />
    </div>
  );
}
