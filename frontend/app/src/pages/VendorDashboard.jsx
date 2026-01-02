import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { StatsCards } from "../components/dashboard/StatsCards";
import { PostList } from "../components/dashboard/PostList";
import { toast } from "react-hot-toast";
import { LayoutDashboard, CreditCard } from "lucide-react";

import { useProductStore } from "../store/productStore";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { posts, getMyPosts, deletePost, isFetchingPosts } = useProductStore();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

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
    if (posts) {
      const totalProducts = posts.reduce(
        (acc, post) => acc + post.products.length,
        0
      );

      setStats({
        productCount: totalProducts,
        activeListings: posts.length,
      });
    }
  }, [posts]);

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

        await getMyPosts();
      } catch (err) {}
    })();
    return () => (mounted = false);
  }, [fetchMe, getMyPosts, navigate]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this entire post?")) {
      return;
    }
    await deletePost(postId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <LayoutDashboard />
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white border"
            >
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                V
              </span>
              <span className="text-sm">
                {user?.data?.vendorName ?? "Vendor"}
              </span>
            </button>
          </div>
        </header>

        <StatsCards stats={stats} loading={isFetchingPosts} />

        <div className="mt-6">
          <PostList
            posts={posts}
            loading={isFetchingPosts}
            onDelete={handleDeletePost}
          />
        </div>
      </div>
    </div>
  );
}
