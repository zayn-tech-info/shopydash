import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

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
