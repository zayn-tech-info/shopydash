import { useEffect } from "react";
import useDashboardStore from "../stores/dashboardStore";
import StatCard from "../components/StatCard";
import { formatCurrency, formatNumber } from "../utils/formatters";
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
  XCircle,
  Crown,
} from "lucide-react";

export default function Dashboard() {
  const { stats, loading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cards = [
    {
      title: "Total Users",
      value: formatNumber(stats?.totalUsers),
      icon: Users,
      color: "#6366f1",
    },
    {
      title: "Total Buyers",
      value: formatNumber(stats?.totalClients),
      icon: Users,
      color: "#3b82f6",
    },
    {
      title: "Total Vendors",
      value: formatNumber(stats?.totalVendors),
      icon: Store,
      color: "#8b5cf6",
    },
    {
      title: "Total Orders",
      value: formatNumber(stats?.totalOrders),
      icon: ShoppingCart,
      color: "#06b6d4",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      icon: DollarSign,
      color: "#10b981",
    },
    {
      title: "Orders Today",
      value: formatNumber(stats?.ordersToday),
      icon: Clock,
      color: "#f59e0b",
    },
    {
      title: "Pending Orders",
      value: formatNumber(stats?.pendingOrders),
      icon: AlertTriangle,
      color: "#f97316",
    },
    {
      title: "Failed Payments",
      value: formatNumber(stats?.failedPayments),
      icon: XCircle,
      color: "#ef4444",
    },
    {
      title: "Active Subscriptions",
      value: formatNumber(stats?.activeSubscriptions),
      icon: Crown,
      color: "#a855f7",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Platform overview and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            loading={loading}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}