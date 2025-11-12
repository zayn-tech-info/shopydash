import { Edit } from "lucide-react";
import Logo from "../../assets/images/clientPfp.png";
import { VendorAddress } from "./VendorAddress";

export default function VendorSidebar({ authUser, vendorProfile, openEdit }) {
  const businessName =
    vendorProfile?.businessName || authUser?.businessName || "Store";
  const username =
    vendorProfile?.storeUsername || vendorProfile?.username || "vendor";
  const profileImage = vendorProfile?.profileImage || Logo;

  return (
    <aside className="bg-white rounded-lg p-6 border border-gray-100 w-full md:w-72 lg:w-80">
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-100 mb-4">
          <img
            src={profileImage}
            alt={businessName}
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-lg font-semibold text-n-9 text-center">
          {businessName}
        </h2>
        <p className="text-sm text-n-6 mt-1 text-center">@{username}</p>

        {authUser && vendorProfile && authUser._id === vendorProfile.userId ? (
          <button
            onClick={openEdit}
            aria-label="Edit profile"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium bg-white"
            title="Edit profile"
          >
            <Edit size={16} />
            <span>Edit profile</span>
          </button>
        ) : (
          <div className="mt-4 w-full">
            <button className="w-full px-4 py-2 bg-primary-3 text-white rounded-md text-sm">
              Message
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-n-7 flex gap-3">
          <div className="text-center">
            {vendorProfile?.rating
              ? `Rating: ${vendorProfile.rating.toFixed(1)}`
              : "Rating: -"}
          </div>
          <div className="text-center text-n-7">
            ({vendorProfile?.reviewsCount ?? 0} reviews)
          </div>
        </div>
      </div>

      <VendorAddress
        authUser={authUser}
        vendorProfile={vendorProfile}
        className="md:block hidden"
      />

      <div className="mt-6 border-t border-gray-100 pt-4 text-sm">
        {authUser ? (
          <div className="text-center text-sm md:block hidden">
            <div className="font-medium">Logged in as</div>
            <div className="mt-1 truncate">
              {authUser?.fullName || authUser?.username || authUser?.email}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="font-medium">Have an account?</div>
            <a
              href="/login"
              className="inline-block mt-2 px-4 py-2 bg-primary-3 text-white rounded-md text-sm"
            >
              Login
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
