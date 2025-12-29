import React from "react";
import { Trash2, Upload, X, ImagePlus } from "lucide-react";

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

export const ProductItem = ({
  product,
  index,
  totalProducts,
  updateProduct,
  removeProduct,
}) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    updateProduct(product.id, "imageFile", file);
    updateProduct(product.id, "previewUrl", previewUrl);
  };

  const removeImage = () => {
    updateProduct(product.id, "imageFile", null);
    updateProduct(product.id, "previewUrl", null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      {}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
            {index + 1}
          </span>
          <h3 className="font-semibold text-gray-800">Product Details</h3>
        </div>
        {totalProducts > 1 && (
          <button
            type="button"
            onClick={() => removeProduct(product.id)}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
            title="Remove Product"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors group">
              {product.previewUrl ? (
                <>
                  <img
                    src={product.previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage();
                      }}
                      className="bg-white text-red-500 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <ImagePlus className="text-orange-500" size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Upload Photo
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Click to browse
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          {}
          <div className="flex-1 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                value={product.title}
                onChange={(e) =>
                  updateProduct(product.id, "title", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                placeholder="e.g., iPhone 13 Pro Max"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (₦)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      updateProduct(product.id, "price", e.target.value)
                    }
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                    placeholder="0.00"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stock
                </label>
                <input
                  type="number"
                  value={product.stock}
                  onChange={(e) =>
                    updateProduct(product.id, "stock", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={product.category}
                  onChange={(e) =>
                    updateProduct(product.id, "category", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Condition
                </label>
                <select
                  value={product.condition}
                  onChange={(e) =>
                    updateProduct(product.id, "condition", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none appearance-none"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={product.description}
                onChange={(e) =>
                  updateProduct(product.id, "description", e.target.value)
                }
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none resize-none"
                rows="4"
                placeholder="Describe your product..."
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
