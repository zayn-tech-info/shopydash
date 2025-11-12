import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { StatsCards } from "../components/dashboard/StatsCards";
import { ProductList } from "../components/dashboard/ProductList";
import { AddProductModal } from "../components/dashboard/AddProductModal";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vendorId = user?.data?._id || user?._id || user?.data?.id || user?.id;

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

  const fetchDashboard = useCallback(async (me) => {
    if (!me) return;
    const id = me.data?._id || me.data?.id || me.id;
    try {
      const [statsRes, productsRes] = await Promise.all([
        api.get(`/api/vendors/${id}/stats`).catch(() => ({ data: null })),
        api
          .get(`/api/vendors/${id}/products?page=1&pageSize=20`)
          .catch(() => ({ data: { products: [] } })),
      ]);

      setStats(statsRes.data || null);
      // standardize products array shape
      const list = productsRes.data?.products || productsRes.data || [];
      setProducts(list);
    } catch (err) {
      console.error("dashboard fetch error", err);
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
        await fetchDashboard(me);
      } catch (err) {
        // handled above
      }
    })();
    return () => (mounted = false);
  }, [fetchMe, fetchDashboard, navigate]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddProduct = async (formData) => {
    // optimistic UI: create temporary product and prepend
    const tempId = `temp-${Date.now()}`;
    const tempProduct = {
      productId: tempId,
      name: formData.name,
      price: formData.price,
      category: formData.category,
      condition: formData.condition,
      location: formData.location,
      visibility: formData.visibility ?? true,
      thumbnail:
        formData.images && formData.images.length > 0
          ? URL.createObjectURL(formData.images[0])
          : undefined,
      createdAt: new Date().toISOString(),
    };

    setProducts((p) => [tempProduct, ...p]);
    handleCloseModal();
    try {
      const id = vendorId;
      const res = await api.post(`/api/vendors/${id}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const created = res.data?.data || res.data || res;
      // replace temp product with actual
      setProducts((p) =>
        p.map((it) => (it.productId === tempId ? created : it))
      );
      toast.success("Product added");
    } catch (err) {
      // revert optimistic update
      setProducts((p) => p.filter((it) => it.productId !== tempId));
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add product");
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
              <p className="text-sm text-gray-500">My Products</p>
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
          <ProductList
            products={products}
            loading={loading}
            onEdit={() => toast("Edit not implemented yet")}
            onDelete={(id) => {
              setProducts((p) => p.filter((x) => x.productId !== id));
              toast.success("Product deleted (optimistic)");
              // you should call DELETE API here
            }}
            onToggleVisibility={async (id, visible) => {
              // optimistic toggle
              setProducts((p) =>
                p.map((it) =>
                  it.productId === id ? { ...it, visibility: visible } : it
                )
              );
              try {
                await api.patch(
                  `/api/vendors/${vendorId}/products/${id}/visibility`,
                  { visibility: visible }
                );
                toast.success("Visibility updated");
              } catch (err) {
                // revert
                setProducts((p) =>
                  p.map((it) =>
                    it.productId === id ? { ...it, visibility: !visible } : it
                  )
                );
                toast.error("Failed to update visibility");
              }
            }}
          />
        </div>

        {/* FAB */}
        <button
          onClick={handleOpenModal}
          aria-label="Add product"
          className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F97316] text-white shadow-lg flex items-center justify-center"
        >
          <Plus size={20} aria-hidden="true" />
        </button>

        <AddProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddProduct}
        />
      </div>
    </div>
  );
}
