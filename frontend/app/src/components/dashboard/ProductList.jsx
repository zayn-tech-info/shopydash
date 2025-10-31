import React from "react";
import { ProductCard } from "./ProductCard";

export function ProductList({
  products,
  loading,
  onEdit,
  onDelete,
  onToggleVisibility,
}) {
  if (loading) {
    // show skeleton grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 shadow-sm animate-pulse h-64"
          />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold">No products yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          You don't have any products. Click Add Product to create your first
          listing.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.productId ?? p.id}
          product={p}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
        />
      ))}
    </div>
  );
}
