import React, { useState } from "react";
import VendorProductItem from "./VendorProductItem";

export default function VendorProducts({ vendor }) {
  const [tab, setTab] = useState("about");

  const products = vendor?.products || [];

  return (
    <div className="bg-white rounded-md shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab("about")}
          className={`px-3 py-2 rounded-t-md ${
            tab === "about" ? "text-n-1 bg-primary-3" : "text-n-6"
          }`}
        >
          About
        </button>
        <button
          onClick={() => setTab("products")}
          className={`px-3 py-2 rounded-t-md ${
            tab === "products" ? "text-n-1 bg-primary-3" : "text-n-6"
          }`}
        >
          Products
        </button>
      </div>

      <div>
        {tab === "about" && (
          <div>
            <h3 className="text-lg font-medium">About</h3>
            <p className="text-n-7 mt-3">
              {vendor?.storeDescription || "No description yet."}
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Category</h4>
                <div className="mt-1">{vendor?.businessCategory || "-"}</div>
              </div>

              <div>
                <h4 className="font-medium">Member since</h4>
                <div className="mt-1">
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
    </div>
  );
}
