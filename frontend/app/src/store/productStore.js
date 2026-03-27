import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getVendorKey(product) {
  return String(
    product?.vendorId?._id ??
      product?.vendorId ??
      product?.vendor?._id ??
      product?.vendor?.id ??
      "unknown",
  );
}

// Best-effort: rearrange so the same vendor doesn't appear side-by-side.
// If it's mathematically impossible (one vendor dominates), we minimize collisions.
function avoidAdjacentSameVendor(products) {
  if (!Array.isArray(products) || products.length < 3) return products;

  const byVendor = new Map();
  for (const p of products) {
    const k = getVendorKey(p);
    const list = byVendor.get(k);
    if (list) list.push(p);
    else byVendor.set(k, [p]);
  }

  // Add randomness within each vendor bucket, so the final ordering is less predictable.
  for (const list of byVendor.values()) shuffleInPlace(list);

  const result = [];
  let prevVendor = null;

  while (result.length < products.length) {
    let bestVendor = null;
    let bestCount = -1;

    for (const [vendor, list] of byVendor.entries()) {
      if (list.length === 0) continue;
      if (vendor === prevVendor) continue;
      if (list.length > bestCount) {
        bestCount = list.length;
        bestVendor = vendor;
      }
    }

    // If we can't pick a different vendor, pick any remaining vendor.
    if (!bestVendor) {
      for (const [vendor, list] of byVendor.entries()) {
        if (list.length > 0) {
          bestVendor = vendor;
          break;
        }
      }
    }

    const bucket = byVendor.get(bestVendor);
    const item = bucket.shift();
    result.push(item);
    prevVendor = bestVendor;
  }

  // One more pass to reduce any remaining adjacent duplicates via swaps.
  for (let i = 1; i < result.length; i++) {
    if (getVendorKey(result[i]) !== getVendorKey(result[i - 1])) continue;
    let swapped = false;
    for (let j = i + 1; j < result.length; j++) {
      if (
        getVendorKey(result[j]) !== getVendorKey(result[i]) &&
        getVendorKey(result[j]) !== getVendorKey(result[i - 1])
      ) {
        [result[i], result[j]] = [result[j], result[i]];
        swapped = true;
        break;
      }
    }
    if (!swapped) {
      // Nothing left to swap with; best-effort ends here.
      break;
    }
  }

  return result;
}

export const useProductStore = create((set, get) => ({
  isUploading: false,
  isCreatingPost: false,
  isDeletingPost: false,
  posts: [],
  isFetchingPosts: false,

  currentProduct: null,
  isFetchingProduct: false,

  feedPosts: [],
  isFetchingFeedPosts: false,
  featuredProducts: [],
  isFetchingFeaturedProducts: false,
  searchResults: [],
  isSearching: false,

  currentSearchPage: 1,
  hasMoreSearchResults: true,

  searchProducts: async (params, isLoadMore = false) => {
    const { searchResults, currentSearchPage } = get();

    const page = isLoadMore ? currentSearchPage + 1 : 1;

    if (!isLoadMore) {
      set({
        isSearching: true,
        searchResults: [],
        hasMoreSearchResults: true,
        currentSearchPage: 1,
      });
    } else {
    }

    try {
      const existingIds = isLoadMore ? searchResults.map((p) => p._id) : [];

      const res = await api.get("/api/v1/post/search", {
        params: { ...params, page, excludedIds: existingIds },
      });

      const newProducts = res.data.data.products;
      const hasMore = res.data.data.hasMore;

      set((state) => ({
        searchResults: isLoadMore
          ? [...state.searchResults, ...newProducts]
          : newProducts,
        isSearching: false,
        currentSearchPage: page,
        hasMoreSearchResults: hasMore,
      }));
    } catch (error) {
      set({ isSearching: false });
      console.error(error);
      toast.error("Search failed");
    }
  },

  getFeedPosts: async (params = {}) => {
    set({ isFetchingFeedPosts: true });
    try {
      const res = await api.get("/api/v1/post/feed", { params });
      const posts = res.data?.data?.posts ?? [];
      set({ feedPosts: Array.isArray(posts) ? posts : [], isFetchingFeedPosts: false });
    } catch (error) {
      set({ feedPosts: [], isFetchingFeedPosts: false });
      console.error("Feed request failed:", error?.response?.status, error?.message);
      toast.error(
        error.response?.data?.message || "Failed to load feed. Check your connection.",
      );
    }
  },

  getFeaturedProducts: async () => {
    const SEEN_KEY = "featuredSeenIds";
    const TOTAL_KEY = "featuredTotal";
    const TARGET = 100;
    const COVERAGE_RESET_RATIO = 0.8;

    let seenIds = [];
    try {
      const stored = sessionStorage.getItem(SEEN_KEY);
      if (stored) seenIds = JSON.parse(stored);
      if (!Array.isArray(seenIds)) seenIds = [];
    } catch (_) {
      seenIds = [];
    }
    let total = parseInt(sessionStorage.getItem(TOTAL_KEY) || "0", 10) || 0;

    set({ isFetchingFeaturedProducts: true });
    try {
      const res = await api.post("/api/v1/post/feed/products/random", {
        excludedIds: seenIds,
        limit: TARGET,
      });
      let products = res.data?.data?.products ?? [];
      const newTotal = res.data?.data?.total ?? 0;
      if (newTotal > 0) total = newTotal;
      sessionStorage.setItem(TOTAL_KEY, String(total));

      if (products.length < TARGET && total >= TARGET) {
        const fillRes = await api.post("/api/v1/post/feed/products/random", {
          limit: TARGET - products.length,
        });
        const fill = fillRes.data?.data?.products ?? [];
        const seenSet = new Set(products.map((p) => String(p._id)));
        for (const p of fill) {
          if (seenSet.has(String(p._id))) continue;
          products.push(p);
          seenSet.add(String(p._id));
          if (products.length >= TARGET) break;
        }
      }

      const ids = products.map((p) => String(p._id));
      const nextSeen = [...new Set([...seenIds, ...ids])];
      if (total > 0 && nextSeen.length >= COVERAGE_RESET_RATIO * total) {
        sessionStorage.setItem(SEEN_KEY, "[]");
      } else {
        sessionStorage.setItem(SEEN_KEY, JSON.stringify(nextSeen));
      }

      const randomized = avoidAdjacentSameVendor(shuffleInPlace([...products]));
      set({
        featuredProducts: Array.isArray(randomized) ? randomized : [],
        isFetchingFeaturedProducts: false,
      });
    } catch (error) {
      set({ featuredProducts: [], isFetchingFeaturedProducts: false });
      console.error("Featured products request failed:", error?.response?.status, error?.message);
      toast.error(
        error.response?.data?.message || "Failed to load featured products. Check your connection.",
      );
    }
  },

  searchFeaturedProducts: async (params = {}) => {
    const { search, school, area } = params || {};
    const trimmedSearch = typeof search === "string" ? search.trim() : "";
    const filterParams = {};
    if (school) filterParams.school = school;
    if (area) filterParams.area = area;

    set({ isFetchingFeaturedProducts: true });
    try {
      let products = [];
      if (trimmedSearch) {
        const res = await api.get("/api/v1/post/search", {
          params: {
            search: trimmedSearch,
            ...filterParams,
            limit: 100,
          },
        });
        products = res.data?.data?.products ?? [];
      } else {
        const res = await api.post(
          "/api/v1/post/feed/products/random",
          { limit: 100 },
          { params: filterParams },
        );
        products = res.data?.data?.products ?? [];
      }

      set({
        featuredProducts: Array.isArray(products) ? products : [],
        isFetchingFeaturedProducts: false,
      });
    } catch (error) {
      set({ featuredProducts: [], isFetchingFeaturedProducts: false });
      console.error(
        "Featured search failed:",
        error?.response?.status,
        error?.message,
      );
      toast.error(
        error.response?.data?.message || "Search failed. Please try again.",
      );
    }
  },

  getMyPosts: async () => {
    set({ isFetchingPosts: true });
    try {
      const res = await api.get("/api/v1/post/my-posts");
      set({ posts: res.data.data.posts, isFetchingPosts: false });
    } catch (error) {
      set({ isFetchingPosts: false });
      toast.error(error.response?.data?.message || "Failed to fetch posts");
    }
  },

  uploadImages: async (files) => {
    set({ isUploading: true });
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await api.post("/api/v1/post/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ isUploading: false });
      return res.data.data;
    } catch (error) {
      set({ isUploading: false });
      toast.error(error.response?.data?.message || "Failed to upload images");
      throw error;
    }
  },

  createPost: async (postData) => {
    set({ isCreatingPost: true });
    try {
      const res = await api.post("/api/v1/post", postData);
      set({ isCreatingPost: false });
      toast.success("Post created successfully!");
      return res.data;
    } catch (error) {
      set({ isCreatingPost: false });
      toast.error(error.response?.data?.message || "Failed to create post");
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    set({ isCreatingPost: true });
    try {
      const res = await api.patch(`/api/v1/post/${id}`, postData);
      set({ isCreatingPost: false });
      toast.success("Post updated successfully!");
      return res.data;
    } catch (error) {
      set({ isCreatingPost: false });
      toast.error(error.response?.data?.message || "Failed to update post");
      throw error;
    }
  },

  deletePost: async (id) => {
    set({ isDeletingPost: true });
    try {
      const res = await api.delete(`/api/v1/post/${id}`);
      set({ isDeletingPost: false });
      toast.success("You deleted a post!");
      get().getMyPosts();
      return res.data;
    } catch (error) {
      set({ isDeletingPost: false });
      toast.error(error.response?.data?.message || "Failed to delete post");
      throw error;
    }
  },

  getProductById: async (productId) => {
    set({ isFetchingProduct: true, currentProduct: null });
    try {
      const res = await api.get(`/api/v1/post/product/${productId}`);
      set({ currentProduct: res.data.data.product, isFetchingProduct: false });
      return res.data.data.product;
    } catch (error) {
      set({ isFetchingProduct: false });
      console.error(error);
      toast.error("Failed to load product details");
      throw error;
    }
  },
}));
