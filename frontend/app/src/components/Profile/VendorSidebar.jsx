import React from "react";
import Logo from "../../assets/images/clientPfp.png";
import { Plus } from "lucide-react";

export default function VendorSidebar({
  clientProfile,
  authUser,
}) {
  return (
    <aside className="bg-white rounded-md shadow-sm p-6 border border-gray-100">
      <div className="pt-4">
        <div className="flex flex-col items-center justify-center sm:justify-start gap-4">
          <div className="w-40 h-40 sm:w40 sm:h-40 rounded-md border-2   shadow relative">
            <img
              src={clientProfile?.profileImage || Logo}
              alt={clientProfile?.businessName || "profile"}
              className="w-full h-full object-cover"
            />
            <div className="w-8 h-8 text-n-1 flex items-center justify-center bg-primary-2 z-50 absolute -bottom-3 -right-4 cursor-pointer rounded-full">
              <Plus size={30} />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-semibold">
              {clientProfile?.businessName || authUser?.businessName || "Store"}
            </h1>
            <p className="text-sm text-n-6 mt-1">
              {clientProfile?.businessCategory || "Seller"}
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

        </div>

        <div className="mt-4 sm:mt-4 flex items-center gap-2 text-yellow-400 text-sm">
          <span className="text-lg">
            {clientProfile?.rating ? "⭐".repeat(Math.round(clientProfile.rating)) : "—"}
          </span>
          <span className="ml-2 text-n-7">Rating: {clientProfile?.rating ?? "-"}</span>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 text-sm space-y-3">
        <div>
          <div className="font-medium">Phone</div>
          <div className="text-primary-4">
            <a
              href={`tel:${clientProfile?.phoneNumber || authUser?.phoneNumber || ""}`}
            >
              {clientProfile?.phoneNumber || authUser?.phoneNumber || "-"}
            </a>
          </div>
        </div>

        <div>
          <div className="font-medium">Email</div>
          <div className="text-primary-4">
            <a href={`mailto:${clientProfile?.email || authUser?.email || ""}`}>
              {clientProfile?.email || authUser?.email || "-"}
            </a>
          </div>
        </div>

        <div>
          <div className="font-medium">Location</div>
          <div>{clientProfile?.address || "-"}</div>
          <div className="text-n-7">
            {[clientProfile?.city, clientProfile?.state, clientProfile?.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        </div>

        <div>
          <div className="font-medium">Payment methods</div>
          <div className="text-sm text-n-7 mt-1">
            {clientProfile?.paymentMethods && clientProfile.paymentMethods.length > 0
              ? clientProfile.paymentMethods.join(", ")
              : "—"}
          </div>
        </div>

        <div>
          <div className="font-medium">Account number</div>
          <div className="text-sm text-n-7 mt-1">
            {clientProfile?.accountNumber || "—"}
          </div>
        </div>
      </div>
    </aside>
  );
}
