import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,

  getCart: async () => {
    set({ isLoading: true, error: null });

    const { authUser } = useAuthStore.getState();

    if (!authUser) {
      try {
        const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        set({ cart: localCart, isLoading: false });
      } catch (error) {
        set({ error: "Failed to load local cart", isLoading: false });
      }
      return;
    }

    try {
      const res = await api.get("/api/v1/cart/");
      set({ cart: res.data.cart.items, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addToCart: async ({ productId, quantity, vendorPostId, productDetails }) => {
    set({ isLoading: true, error: null });
    const { authUser } = useAuthStore.getState();

    if (!authUser) {
      try {
        const currentCart = get().cart;
        const existingItemIndex = currentCart.findIndex(
          (item) => item.productId === productId,
        );

        let newCart;
        if (existingItemIndex > -1) {
          newCart = [...currentCart];
          newCart[existingItemIndex].quantity += quantity;
        } else {
          newCart = [
            ...currentCart,
            {
              productId,
              quantity,
              vendorPostId,
              ...productDetails, // Spread passed details (title, price, image, vendor info)
              vendorId: productDetails?.vendor || {
                _id: "guest-vendor",
                businessName: "Vendor",
              },
            },
          ];
        }

        localStorage.setItem("guestCart", JSON.stringify(newCart));
        set({ cart: newCart, isLoading: false });
        toast.success("Item added to cart");
      } catch (error) {
        set({ error: "Failed to add to local cart", isLoading: false });
      }
      return;
    }

    try {
      const res = await api.post("/api/v1/cart/", {
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
    const { authUser } = useAuthStore.getState();

    set({
      cart: previousCart.filter((item) => item.productId !== productId),
    });

    if (!authUser) {
      const newCart = previousCart.filter(
        (item) => item.productId !== productId,
      );
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      return;
    }

    try {
      await api.delete("/api/v1/cart/", { data: { productId } });
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

    const { authUser } = useAuthStore.getState();
    const previousCart = get().cart;

    const newCart = previousCart.map((item) =>
      item.productId === productId ? { ...item, quantity } : item,
    );

    set({ cart: newCart });

    if (!authUser) {
      localStorage.setItem("guestCart", JSON.stringify(newCart));
      return;
    }

    try {
      await api.patch("/api/v1/cart/", { productId, quantity });
    } catch (error) {
      set({ cart: previousCart });
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  clearCart: async () => {
    set({ cart: [] });
    const { authUser } = useAuthStore.getState();

    if (!authUser) {
      localStorage.removeItem("guestCart");
      return;
    }

    try {
      await api.delete("/api/v1/cart/clear");
    } catch (error) {
      console.error("Failed to clear remote cart", error);
    }
  },

  getCartCount: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
}));
