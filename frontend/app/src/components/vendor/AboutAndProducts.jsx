import React, { useState } from "react";
import VendorProductItem from "./VendorProductItem";

export default function AboutAndProducts({ vendor }) {
  const [tab, setTab] = useState("about");

  const products = vendor?.products || [];

  return (
    <section>
      <div className="flex items-center gap-8 mb-8 border-b border-n-3/10">
        <button
          onClick={() => setTab("about")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            tab === "about" ? "text-primary-3" : "text-n-4 hover:text-n-6"
          }`}
        >
          About
          {tab === "about" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-3 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setTab("products")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            tab === "products" ? "text-primary-3" : "text-n-4 hover:text-n-6"
          }`}
        >
          Products
          {tab === "products" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-3 rounded-t-full" />
          )}
        </button>
      </div>

      <div>
        {tab === "about" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="h5 text-n-8 mb-4">About</h3>
              <p className="body-2 text-n-6 leading-relaxed">
                {vendor?.storeDescription || "No description yet."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-n-1 rounded-xl p-4 border border-n-3/10">
                <h4 className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="text-n-8 font-medium">
                  {vendor?.businessCategory || "-"}
                </div>
              </div>

              <div className="bg-n-1 rounded-xl p-4 border border-n-3/10">
                <h4 className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Member since
                </h4>
                <div className="text-n-8 font-medium">
                  {vendor?.createdAt
                    ? new Date(vendor.createdAt).toLocaleDateString()
                    : "--"}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="animate-in fade-in duration-500">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-n-4 body-2">No products uploaded yet.</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((p) => (
                  <VendorProductItem key={p._id || p} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
