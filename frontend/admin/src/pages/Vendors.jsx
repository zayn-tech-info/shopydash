import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useVendorStore from "../stores/vendorStore";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import useDebounce from "../hooks/useDebounce";
import { formatDate, formatCurrency } from "../utils/formatters";

export default function Vendors() {
  const navigate = useNavigate();
  const { vendors, pagination, loading, fetchVendors } = useVendorStore();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", kycStatus: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const debouncedSearch = useDebounce(search);

  const loadVendors = useCallback(() => {
    fetchVendors({
      page,
      limit,
      search: debouncedSearch || undefined,
      status: filters.status || undefined,
      kycStatus: filters.kycStatus || undefined,
    });
  }, [page, limit, debouncedSearch, filters, fetchVendors]);

  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const columns = [
    {
      id: "storeName",
      label: "Store",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">
            {row.userId?.businessName || row.storeUsername || "—"}
          </p>
          <p className="text-xs text-gray-500">{row.userId?.email}</p>
        </div>
      ),
    },
    {
      id: "owner",
      label: "Owner",
      render: (row) => row.userId?.fullName || "—",
    },
    {
      id: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "kycStatus",
      label: "KYC",
      render: (row) => <StatusBadge status={row.kycStatus} />,
    },
    {
      id: "subscription",
      label: "Plan",
      render: (row) =>
        row.userId?.isSubscriptionActive
          ? row.userId?.subscriptionPlan
          : "Free",
    },
    {
      id: "orders",
      label: "Orders",
      render: (row) => row.orderStats?.totalOrders || 0,
    },
    {
      id: "revenue",
      label: "Revenue",
      render: (row) => formatCurrency(row.orderStats?.totalRevenue),
    },
    {
      id: "createdAt",
      label: "Joined",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const tableFilters = [
    {
      id: "status",
      label: "Status",
      value: filters.status,
      options: [
        { value: "active", label: "Active" },
        { value: "suspended", label: "Suspended" },
      ],
    },
    {
      id: "kycStatus",
      label: "KYC Status",
      value: filters.kycStatus,
      options: [
        { value: "verified", label: "Verified" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
        { value: "none", label: "None" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all vendors on the platform
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={vendors}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        onRowClick={(row) => navigate(`/vendors/${row._id}`)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search vendors..."
        filters={tableFilters}
        onFilterChange={(id, val) =>
          setFilters((f) => ({ ...f, [id]: val }))
        }
        loading={loading}
      />
    </div>
  );
}
