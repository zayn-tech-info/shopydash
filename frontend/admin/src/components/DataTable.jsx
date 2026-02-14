import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Skeleton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search } from "lucide-react";
import EmptyState from "./EmptyState";

/**
 * Reusable data table with search, filters, pagination
 *
 * @param {Object} props
 * @param {Array} props.columns - [{ id, label, render?, align?, width? }]
 * @param {Array} props.rows - Data rows
 * @param {Object} props.pagination - { total, page, limit, pages }
 * @param {Function} props.onPageChange - (page) => void
 * @param {Function} props.onRowsPerPageChange - (rowsPerPage) => void
 * @param {Function} props.onRowClick - (row) => void
 * @param {string} props.searchValue
 * @param {Function} props.onSearchChange
 * @param {string} props.searchPlaceholder
 * @param {Array} props.filters - [{ id, label, value, options: [{value, label}] }]
 * @param {Function} props.onFilterChange - (filterId, value) => void
 * @param {boolean} props.loading
 */
export default function DataTable({
  columns = [],
  rows = [],
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onFilterChange,
  loading = false,
}) {
  return (
    <Paper
      sx={{
        borderRadius: 3,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
        overflow: "hidden",
      }}
    >
      {/* Search & Filters Bar */}
      {(onSearchChange || filters.length > 0) && (
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ minWidth: 240 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          {filters.map((filter) => (
            <FormControl key={filter.id} size="small" sx={{ minWidth: 140 }}>
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filter.value || ""}
                label={filter.label}
                onChange={(e) => onFilterChange(filter.id, e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {filter.options.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </div>
      )}

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || "left"}
                  sx={{
                    fontWeight: 700,
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: col.width,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((col) => (
                      <TableCell key={col.id}>
                        <Skeleton height={24} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row, idx) => (
                  <TableRow
                    key={row._id || idx}
                    hover
                    onClick={() => onRowClick?.(row)}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:last-child td": { borderBottom: 0 },
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align || "left"}>
                        {col.render ? col.render(row) : row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {!loading && rows.length === 0 && <EmptyState />}

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(pagination.page || 1) - 1}
          onPageChange={(_, p) => onPageChange?.(p + 1)}
          rowsPerPage={pagination.limit || 20}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange?.(parseInt(e.target.value))
          }
          rowsPerPageOptions={[10, 20, 50]}
        />
      )}
    </Paper>
  );
}
