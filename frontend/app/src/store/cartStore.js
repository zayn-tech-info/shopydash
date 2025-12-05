import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,

  getCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/v1/cart/");
      set({ cart: res.data.cart.items, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addToCart: async ({ productId, quantity, vendorPostId }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/v1/cart/add", {
        productId,
        quantity,
        vendorPostId,
      });
      console.log(res);
      set({ cart: res.data.cart.items, isLoading: false });
      toast.success("Item added to cart");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error adding to cart",
        isLoading: false,
      });
      console.log(error);
      throw error;
    }
  },

  removeFromCart: async (productId) => {
    const previousCart = get().cart;
    set({
      cart: previousCart.filter((item) => item.productId !== productId),
    });

    try {
      await api.post("/api/v1/cart/remove", { productId });
    } catch (error) {
      set({ cart: previousCart });
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    // Optimistic update
    const previousCart = get().cart;
    set({
      cart: previousCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    });

    try {
      await api.patch("/api/v1/cart/update", { productId, quantity });
    } catch (error) {
      // Revert if failed
      set({ cart: previousCart });
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  clearCart: () => set({ cart: [] }),

  getCartCount: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
}));
