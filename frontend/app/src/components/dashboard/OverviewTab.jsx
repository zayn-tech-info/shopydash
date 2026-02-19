import { memo, useMemo } from "react";
import { Package, ShoppingCart, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function RecentProductCard({ product, post }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <img
        src={product.image}
        alt={product.title}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {product.title}
        </p>
        <p className="text-xs text-gray-500">
          ₦{Number(product.price).toLocaleString()}
        </p>
      </div>
      <span className="text-xs text-gray-400">
        {formatDate(post.createdAt)}
      </span>
    </div>
  );
}

function OverviewTabComponent({ posts, loading, orders }) {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const stats = useMemo(() => {
    if (!posts) return { totalProducts: 0, activeListings: 0, totalOrders: 0 };

    const totalProducts = posts.reduce(
      (acc, post) => acc + post.products.length,
      0,
    );

    return {
      totalProducts,
      activeListings: posts.length,
      totalOrders: orders?.length || 0,
    };
  }, [posts, orders]);

  const recentProducts = useMemo(() => {
    if (!posts) return [];

    // Get all products with their post info, sorted by date
    const allProducts = posts
      .flatMap((post) =>
        post.products.map((product) => ({
          ...product,
          post,
        })),
      )
      .sort((a, b) => new Date(b.post.createdAt) - new Date(a.post.createdAt))
      .slice(0, 5);

    return allProducts;
  }, [posts]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse"
            >
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Welcome back! 👋</h2>
        <p className="text-sm text-gray-500 mt-1">
          Here's what's happening with your store
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Listings"
          value={stats.activeListings}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.totalOrders}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={orders?.filter((o) => o.status === "pending").length || 0}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Quick Actions (Reduced Size) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/vendor/add")}
          className="flex items-center p-2 bg-primary-3 text-white rounded-lg text-left hover:bg-primary-4 transition-colors min-h-0"
          style={{ minHeight: 0 }}
        >
          <Package className="w-5 h-5 mr-2" />
          <div>
            <p className="font-medium text-base leading-tight">Add Product</p>
            <p className="text-xs opacity-80 leading-tight">List a new item for sale</p>
          </div>
        </button>
        <button
          onClick={() => navigate(`/p/${authUser?.username}`)}
          className="flex items-center p-2 bg-gray-100 text-gray-900 rounded-lg text-left hover:bg-gray-200 transition-colors min-h-0"
          style={{ minHeight: 0 }}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          <div>
            <p className="font-medium text-base leading-tight">View Profile</p>
            <p className="text-xs text-gray-500 leading-tight">Update your store info</p>
          </div>
        </button>
      </div>
    </div>
  );
}

export const OverviewTab = memo(OverviewTabComponent);
