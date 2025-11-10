import React from "react";
import Logo from "../../assets/images/vendora_logo.png";

export default function VendorSidebar({
  vendor,
  authUser,
  onEdit,
  onCopy,
  onLogout,
}) {
  return (
    <aside className="bg-white rounded-md shadow-sm p-6 border border-gray-100">
      <div className="pt-4">
        <div className="flex items-center justify-center sm:justify-start gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border-2 border-gray-100 shadow bg-white">
            <img
              src={vendor?.profileImage || Logo}
              alt={vendor?.businessName || "profile"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-semibold">
              {vendor?.businessName || authUser?.businessName || "Store"}
            </h1>
            <p className="text-sm text-n-6 mt-1">
              {vendor?.businessCategory || "Seller"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button className="h-11 px-5 bg-primary-3 text-nowrap text-white rounded-md text-sm inline-flex items-center justify-center">
            Send message
          </button>
          <button className="h-11 px-4 border rounded-md text-sm inline-flex items-center justify-center">
            Contacts
          </button>
          {authUser && vendor && authUser._id === vendor.userId ? (
            <>
              <button
                onClick={onEdit}
                aria-label="Edit profile"
                className="p-2 rounded-md border bg-white"
                title="Edit profile"
              >
                Edit
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded-md bg-primary-3 text-white text-sm"
                title="Logout"
              >
                Logout
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-4 sm:mt-4 flex items-center gap-2 text-yellow-400 text-sm">
          <span className="text-lg">
            {vendor?.rating ? "⭐".repeat(Math.round(vendor.rating)) : "—"}
          </span>
          <span className="ml-2 text-n-7">Rating: {vendor?.rating ?? "-"}</span>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 text-sm space-y-3">
        <div>
          <div className="font-medium">Phone</div>
          <div className="text-primary-4">
            <a
              href={`tel:${vendor?.phoneNumber || authUser?.phoneNumber || ""}`}
            >
              {vendor?.phoneNumber || authUser?.phoneNumber || "-"}
            </a>
          </div>
        </div>

        <div>
          <div className="font-medium">Email</div>
          <div className="text-primary-4">
            <a href={`mailto:${vendor?.email || authUser?.email || ""}`}>
              {vendor?.email || authUser?.email || "-"}
            </a>
          </div>
        </div>

        <div>
          <div className="font-medium">Location</div>
          <div>{vendor?.address || "-"}</div>
          <div className="text-n-7">
            {[vendor?.city, vendor?.state, vendor?.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        </div>

        <div>
          <div className="font-medium">Payment methods</div>
          <div className="text-sm text-n-7 mt-1">
            {vendor?.paymentMethods && vendor.paymentMethods.length > 0
              ? vendor.paymentMethods.join(", ")
              : "—"}
          </div>
        </div>

        <div>
          <div className="font-medium">Account number</div>
          <div className="text-sm text-n-7 mt-1">
            {vendor?.accountNumber || "—"}
          </div>
        </div>
      </div>
    </aside>
  );
}
