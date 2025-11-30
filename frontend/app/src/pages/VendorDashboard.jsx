import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { StatsCards } from "../components/dashboard/StatsCards";
import { PostList } from "../components/dashboard/PostList";
import { toast } from "react-hot-toast";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/posts/my-posts");
      const fetchedPosts = res.data.data.posts || [];

      setPosts(fetchedPosts);
      const totalProducts = fetchedPosts.reduce(
        (acc, post) => acc + post.products.length,
        0
      );

      setStats({
        totalProducts: totalProducts,
        totalViews: 0, // Not available yet
        totalSales: 0, // Not available yet
      });
    } catch (err) {
      console.error("dashboard fetch error", err);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await fetchMe();
        if (!mounted) return;
        if (me && me.data?.role !== "vendor" && me.role !== "vendor") {
          toast.error("You must be a vendor to access this page");
          navigate("/");
          return;
        }
        await fetchDashboard();
      } catch (err) {
        // handled above
      }
    })();
    return () => (mounted = false);
  }, [fetchMe, fetchDashboard, navigate]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this entire post?")) {
      return;
    }

    // Optimistic update
    const previousPosts = [...posts];
    setPosts(posts.filter((p) => p._id !== postId));

    try {
      await api.delete(`/api/v1/posts/${postId}`);
      toast.success("Post deleted successfully");

      // Update stats after deletion
      const updatedPosts = posts.filter((p) => p._id !== postId);
      const totalProducts = updatedPosts.reduce(
        (acc, post) => acc + post.products.length,
        0
      );
      setStats((prev) => ({ ...prev, totalProducts }));
    } catch (err) {
      // Revert on failure
      setPosts(previousPosts);
      console.error("Delete post error", err);
      toast.error(err?.response?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img src="/logo192.png" alt="Vendora" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <p className="text-sm text-gray-500">My Posts</p>
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

        <StatsCards stats={stats} loading={loading} />

        <div className="mt-6">
          <PostList
            posts={posts}
            loading={loading}
            onDelete={handleDeletePost}
          />
        </div>
      </div>
    </div>
  );
}
