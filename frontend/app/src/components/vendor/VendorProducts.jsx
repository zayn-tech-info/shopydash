import React, { useState } from "react";
import VendorProductItem from "./VendorProductItem";

export default function VendorProducts({ vendor }) {
  const [tab, setTab] = useState("about");

  const products = vendor?.products || [];

  return (
    <section className="bg-white rounded-lg p-6 border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setTab("about")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            tab === "about"
              ? "bg-primary-3 text-white"
              : "text-n-6 bg-white border border-transparent"
          }`}
        >
          About
        </button>
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            tab === "products"
              ? "bg-primary-3 text-white"
              : "text-n-6 bg-white border border-transparent"
          }`}
        >
          Products
        </button>
      </div>

      <div>
        {tab === "about" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-n-7">
              {vendor?.storeDescription || "No description yet."}
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-sm">Category</h4>
                <div className="mt-1 text-base">
                  {vendor?.businessCategory || "-"}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm">Member since</h4>
                <div className="mt-1 text-base">
                  {vendor?.createdAt
                    ? new Date(vendor.createdAt).toLocaleDateString()
                    : "--"}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-3">
            {products.length === 0 && (
              <div className="text-sm text-n-6">No products uploaded yet.</div>
            )}
            {products.map((p) => (
              <VendorProductItem key={p._id || p} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
