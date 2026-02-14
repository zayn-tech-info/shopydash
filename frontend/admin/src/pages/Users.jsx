import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import useDebounce from "../hooks/useDebounce";
import { formatDate } from "../utils/formatters";
import { capitalize } from "../utils/formatters";

export default function Users() {
  const navigate = useNavigate();
  const { users, pagination, loading, fetchUsers } = useUserStore();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "", isVerified: "" });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const debouncedSearch = useDebounce(search);

  const loadUsers = useCallback(() => {
    fetchUsers({
      page,
      limit,
      search: debouncedSearch || undefined,
      role: filters.role || undefined,
      isVerified: filters.isVerified || undefined,
    });
  }, [page, limit, debouncedSearch, filters, fetchUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const columns = [
    {
      id: "fullName",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.profilePic ? (
            <img
              src={row.profilePic}
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
              {row.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{row.fullName}</p>
            <p className="text-xs text-gray-500">@{row.username || "—"}</p>
          </div>
        </div>
      ),
    },
    { id: "email", label: "Email" },
    {
      id: "role",
      label: "Role",
      render: (row) => (
        <span className="text-sm font-medium">{capitalize(row.role)}</span>
      ),
    },
    {
      id: "isVerified",
      label: "Verified",
      render: (row) => <StatusBadge status={row.isVerified ? "true" : "false"} />,
    },
    {
      id: "isBanned",
      label: "Banned",
      render: (row) =>
        row.isBanned ? <StatusBadge status="suspended" /> : null,
    },
    {
      id: "createdAt",
      label: "Joined",
      render: (row) => formatDate(row.createdAt),
    },
  ];

  const tableFilters = [
    {
      id: "role",
      label: "Role",
      value: filters.role,
      options: [
        { value: "client", label: "Client" },
        { value: "vendor", label: "Vendor" },
        { value: "admin", label: "Admin" },
      ],
    },
    {
      id: "isVerified",
      label: "Verified",
      value: filters.isVerified,
      options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all users on the platform
        </p>
      </div>

      <DataTable
        columns={columns}
        rows={users}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        onRowClick={(row) => navigate(`/users/${row._id}`)}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users..."
        filters={tableFilters}
        onFilterChange={(id, val) =>
          setFilters((f) => ({ ...f, [id]: val }))
        }
        loading={loading}
      />
    </div>
  );
}
