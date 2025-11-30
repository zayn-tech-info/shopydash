import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set) => ({
  isUploading: false,
  isCreatingPost: false,

  uploadImages: async (files) => {
    set({ isUploading: true });
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await api.post("/api/v1/posts/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ isUploading: false });
      return res.data.data; // Returns array of image URLs
    } catch (error) {
      set({ isUploading: false });
      toast.error(error.response?.data?.message || "Failed to upload images");
      throw error;
    }
  },

  createPost: async (postData) => {
    set({ isCreatingPost: true });
    try {
      const res = await api.post("/api/v1/posts", postData);
      set({ isCreatingPost: false });
      toast.success("Post created successfully!");
      return res.data;
    } catch (error) {
      set({ isCreatingPost: false });
      toast.error(error.response?.data?.message || "Failed to create post");
      throw error;
    }
  },
}));
