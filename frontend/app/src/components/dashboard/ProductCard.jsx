import React from "react";
import { ShoppingCart, Edit3, Trash2, Eye } from "lucide-react";

export function ProductCard({ product, onEdit, onDelete, onToggleVisibility }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
      <div className="relative aspect-[4/5] bg-gray-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-sm font-semibold">
          ₦{Number(product.price).toLocaleString()}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[11px]">
              {product.visibility ? "In stock" : "Hidden"}
            </span>
            <span className="text-[12px]">{product.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(product)}
              aria-label="Edit product"
              className="p-1 rounded hover:bg-gray-100"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => onDelete(product.productId)}
              aria-label="Delete product"
              className="p-1 rounded hover:bg-gray-100"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={() =>
                onToggleVisibility(product.productId, !product.visibility)
              }
              aria-label="Toggle visibility"
              className="p-1 rounded hover:bg-gray-100"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
