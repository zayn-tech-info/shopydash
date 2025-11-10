import React, { useState } from "react";
import WishlistItem from "./WishlistItem";

export default function AboutWishlist({ profile }) {
  const [tab, setTab] = useState("about");

  const wishlist = profile?.wishlist || [];

  return (
    <div className="flex-1 bg-white p-6 rounded-md border shadow-sm">
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={() => setTab("wishlist")}
          className={`px-3 py-2 rounded-t-md ${
            tab === "wishlist" ? "text-n-1 bg-primary-3" : "text-n-6"
          }`}
        >
          Wishlist
        </button>
        <button
          onClick={() => setTab("about")}
          className={`px-3 py-2 rounded-t-md ${
            tab === "about" ? "text-n-1 bg-primary-3" : "text-n-6"
          }`}
        >
          About
        </button>
      </div>

      <div>
        {tab === "about" && (
          <div>
            <h4 className="text-sm font-semibold text-n-9 mb-3">
              Contact information
            </h4>
            <div className="text-sm text-n-7 space-y-2">
              <div>
                <div className="text-xs text-n-6">Phone</div>
                <div className="text-n-9">{profile?.phoneNumber || "-"}</div>
              </div>

              <div>
                <div className="text-xs text-n-6">Address</div>
                <div className="text-n-9">{profile?.address || "-"}</div>
                <div className="text-n-7 mt-1">
                  {[profile?.city, profile?.state, profile?.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>

              <div>
                <div className="text-xs text-n-6">Preferred category</div>
                <div className="text-n-9">
                  {profile?.preferredCategory || "-"}
                </div>
              </div>
            </div>

            <hr className="my-6" />

            <h4 className="text-sm font-semibold text-n-9 mb-3">
              Basic information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-n-7">
              <div>
                <div className="text-xs text-n-6">Gender</div>
                <div>{profile?.gender || "-"}</div>
              </div>
              <div>
                <div className="text-xs text-n-6">Last login</div>
                <div>
                  {profile?.lastLogin
                    ? new Date(profile.lastLogin).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-n-7">
              <div className="text-xs text-n-6">Member since</div>
              <div>
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
        )}

        {tab === "wishlist" && (
          <div className="space-y-3">
            {wishlist.length === 0 && (
              <div className="text-sm text-n-6">No items in wishlist.</div>
            )}
            {wishlist.map((w) => (
              <WishlistItem key={w.itemId?._id || w.itemId} item={w.itemId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
