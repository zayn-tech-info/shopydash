import React, { useState, memo, useEffect } from "react";
import VendorProductItem from "./VendorProductItem";
import { useReviewStore } from "../../store/reviewStore";
import { Star, User } from "lucide-react";

function AboutAndProducts({ vendor }) {
  const [tab, setTab] = useState("products");
  const [visibleCount, setVisibleCount] = useState(20);
  const { reviews, getVendorReviews, isLoading } = useReviewStore();
  const products = vendor?.products || [];

  useEffect(() => {
    if (tab === "reviews" && vendor?.userId?._id) {
      getVendorReviews(vendor._id);
    }
  }, [tab, vendor, getVendorReviews]);

  return (
    <section>
      <div className="flex items-center gap-8 mb-8 border-b border-n-3/10">
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
          onClick={() => setTab("reviews")}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            tab === "reviews" ? "text-primary-3" : "text-n-4 hover:text-n-6"
          }`}
        >
          Reviews
          {tab === "reviews" && (
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
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(vendor?.businessCategory) ? (
                    vendor.businessCategory.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-n-2 rounded-full text-xs font-medium text-n-6 border border-n-3/10"
                      >
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="text-n-8 font-medium">
                      {vendor?.businessCategory || "-"}
                    </span>
                  )}
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
                {products.slice(0, visibleCount).map((p) => (
                  <VendorProductItem
                    key={p._id || p}
                    product={p}
                    vendorId={vendor?.userId?._id}
                  />
                ))}
              </div>
            )}
            {products.length > visibleCount && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="px-6 py-2 rounded-full border border-n-3/10 text-n-6 font-bold text-sm hover:border-primary-3 hover:text-primary-3 transition-colors"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        )}
        {tab === "reviews" && (
          <div className="animate-in fade-in duration-500 space-y-6">
            {isLoading ? (
              <div className="text-center py-8 text-n-4">
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-n-4 body-2">No reviews yet.</div>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-n-1 rounded-xl p-6 border border-n-3/10"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-n-2 overflow-hidden flex items-center justify-center">
                        {review.reviewer?.profilePic ? (
                          <img
                            src={review.reviewer.profilePic}
                            alt="reviewer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={20} className="text-n-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-n-8 text-sm">
                          {review.reviewer?.fullName || "Anonymous"}
                        </div>
                        <div className="text-xs text-n-4">
                          {new Date(review.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-n-3 text-n-3"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-n-6 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(AboutAndProducts);
