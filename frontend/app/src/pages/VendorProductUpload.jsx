import { useState } from "react";
import { useProductStore } from "../store/productStore";
import { Plus, Trash2, Upload, X, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Books",
  "Food & Beverages",
  "Sports & Fitness",
  "Health & Beauty",
  "Home & Living",
  "Stationery",
  "Services",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Used"];

const VendorProductUpload = () => {
  const navigate = useNavigate();
  const { createPost, uploadImages, isCreatingPost, isUploading } =
    useProductStore();

  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      title: "",
      price: "",
      description: "",
      category: "",
      condition: "New",
      stock: 1,
      images: [], // File objects
      previewUrls: [],
    },
  ]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now(),
        title: "",
        price: "",
        description: "",
        category: "",
        condition: "New",
        stock: 1,
        images: [],
        previewUrls: [],
      },
    ]);
  };

  const removeProduct = (id) => {
    if (products.length <= 1) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id, field, value) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleImageChange = (id, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setProducts(
      products.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            images: [...p.images, ...files],
            previewUrls: [...p.previewUrls, ...newPreviewUrls],
          };
        }
        return p;
      })
    );
  };

  const removeImage = (productId, imageIndex) => {
    setProducts(
      products.map((p) => {
        if (p.id === productId) {
          const newImages = [...p.images];
          const newPreviews = [...p.previewUrls];
          newImages.splice(imageIndex, 1);
          newPreviews.splice(imageIndex, 1);
          return { ...p, images: newImages, previewUrls: newPreviews };
        }
        return p;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (products.length < 4) {
      alert("You must upload at least 4 products per post.");
      return;
    }

    for (const p of products) {
      if (
        !p.title ||
        !p.price ||
        !p.category ||
        !p.description ||
        p.images.length === 0
      ) {
        alert(
          "Please fill in all fields and add at least one image for each product."
        );
        return;
      }
    }

    try {
      // 1. Upload images for each product
      const processedProducts = await Promise.all(
        products.map(async (p) => {
          const imageUrls = await uploadImages(p.images);
          return {
            title: p.title,
            price: Number(p.price),
            description: p.description,
            category: p.category,
            condition: p.condition,
            stock: Number(p.stock),
            images: imageUrls,
          };
        })
      );

      // 2. Create the post
      await createPost({
        content,
        location,
        products: processedProducts,
      });

      navigate("/vendor/dashboard");
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
          <p className="mt-2 text-gray-600">
            Share your latest products with the community. You must add at least
            4 products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Post Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Post Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption / Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Tell us about these products..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (e.g., Under G, Moremi Hall)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Where can buyers find you?"
                  required
                />
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Product #{index + 1}
                  </h3>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={product.title}
                        onChange={(e) =>
                          updateProduct(product.id, "title", e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Product Name"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₦)
                        </label>
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) =>
                            updateProduct(product.id, "price", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="0.00"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={product.stock}
                          onChange={(e) =>
                            updateProduct(product.id, "stock", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={product.category}
                          onChange={(e) =>
                            updateProduct(
                              product.id,
                              "category",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select...</option>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition
                        </label>
                        <select
                          value={product.condition}
                          onChange={(e) =>
                            updateProduct(
                              product.id,
                              "condition",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          {CONDITIONS.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={product.description}
                        onChange={(e) =>
                          updateProduct(
                            product.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="3"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column: Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images (Max 5)
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {product.previewUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                        >
                          <img
                            src={url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(product.id, idx)}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {product.previewUrls.length < 5 && (
                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                          <Upload className="text-gray-400" size={24} />
                          <span className="text-xs text-gray-500 mt-1">
                            Upload
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleImageChange(product.id, e)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
            <button
              type="button"
              onClick={addProduct}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors font-medium"
            >
              <Plus size={20} />
              Add Another Product
            </button>

            <button
              type="submit"
              disabled={isCreatingPost || isUploading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
            >
              {isCreatingPost || isUploading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                "Post Products"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorProductUpload;
