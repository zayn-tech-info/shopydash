import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Menu, Plus } from "lucide-react";

import { useProductStore } from "../store/productStore";
import { useOrderStore } from "../store/orderStore";

import { Sidebar } from "../components/dashboard/Sidebar";
import { OverviewTab } from "../components/dashboard/OverviewTab";
import { ProductsTab } from "../components/dashboard/ProductsTab";
import { OrdersTab } from "../components/dashboard/OrdersTab";
import { SettingsTab } from "../components/dashboard/SettingsTab";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { posts, getMyPosts, isFetchingPosts } = useProductStore();
  const { orders, fetchOrders } = useOrderStore();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/auth/check");
      const payload = res?.data?.data ?? res?.data ?? res;
      setUser(payload);
      return payload;
    } catch (err) {
      console.error("me error", err);
      toast.error("You are not authenticated");
      navigate("/login");
      throw err;
    }
  }, [navigate]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await fetchMe();
        if (!mounted) return;

        if (me && me.role !== "vendor") {
          toast.error("You must be a vendor to access this page");
          navigate("/");
          return;
        }

        if (me && !me.hasProfile) {
          toast("Please complete your vendor profile first", { icon: "📝" });
          navigate("/create-vendor-profile");
          return;
        }

        await Promise.all([getMyPosts(), fetchOrders("vendor")]);
      } catch (err) {}
    })();
    return () => (mounted = false);
  }, [fetchMe, getMyPosts, fetchOrders, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab posts={posts} loading={isFetchingPosts} orders={orders} />
        );
      case "products":
        return <ProductsTab posts={posts} loading={isFetchingPosts} />;
      case "orders":
        return <OrdersTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return (
          <OverviewTab posts={posts} loading={isFetchingPosts} orders={orders} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-x-hidden">
        {/* Mobile Header - only shows hamburger on mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-lg font-semibold text-gray-900 capitalize">
                {activeTab === "overview" ? "Dashboard" : activeTab}
              </h1>
            </div>
            <button
              onClick={() => navigate("/vendor/add")}
              className="inline-flex items-center gap-2 px-3 py-2 bg-primary-3 text-white text-sm font-medium rounded-lg hover:bg-primary-4 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-4 sm:p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
