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
    <aside className="bg-white rounded-2xl p-6 border border-n-3/20 shadow-sm w-full">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-n-1 shadow-sm mb-4 relative group">
          <img
            src={profileImage}
            alt={businessName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <h2 className="h4 text-n-8 text-center mb-1">{businessName}</h2>
        <p className="body-2 text-n-4 text-center font-code">@{username}</p>

        {authUser && vendorProfile && authUser._id === vendorProfile.userId ? (
          <button
            onClick={openEdit}
            aria-label="Edit profile"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 transition-all font-code text-xs font-bold uppercase tracking-wider bg-n-1"
            title="Edit profile"
          >
            <Edit size={16} />
            <span>Edit profile</span>
          </button>
        ) : (
          <div className="mt-6 w-full">
            <button className="w-full px-6 py-3 bg-primary-3 hover:bg-primary-4 text-white rounded-xl transition-colors font-code text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary-3/20">
              Message
            </button>
          </div>
        )}

        <div className="mt-6 w-full grid grid-cols-2 gap-4 text-center">
          <div className="bg-n-2/10 rounded-lg p-3">
            <div className="text-n-4 text-xs font-bold uppercase tracking-wider mb-1">
              Rating
            </div>
            <div className="text-n-8 font-bold">
              {vendorProfile?.rating ? vendorProfile.rating.toFixed(1) : "-"}
            </div>
          </div>
          <div className="bg-n-2/10 rounded-lg p-3">
            <div className="text-n-4 text-xs font-bold uppercase tracking-wider mb-1">
              Reviews
            </div>
            <div className="text-n-8 font-bold">
              {vendorProfile?.reviewsCount ?? 0}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-n-3/10">
        <VendorAddress
          authUser={authUser}
          vendorProfile={vendorProfile}
          className="md:block hidden"
        />
      </div>

      <div className="mt-6 pt-4 border-t border-n-3/10 text-sm">
        {authUser ? (
          <div className="text-center text-sm md:block hidden">
            <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
              Logged in as
            </div>
            <div className="truncate text-n-6 font-medium">
              {authUser?.fullName || authUser?.username || authUser?.email}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="font-medium text-n-6 mb-2">Have an account?</div>
            <a
              href="/login"
              className="inline-block px-6 py-2 bg-n-1 border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 rounded-lg transition-all font-code text-xs font-bold uppercase tracking-wider"
            >
              Login
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
