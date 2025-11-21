export function VendorAddress({ vendorProfile, authUser, className }) {
  return (
    <div className={className}>
      <div className="bg-n-1 rounded-xl border border-n-3/10 p-5 space-y-4">
        <div>
          <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
            Address
          </div>
          <div className="text-n-8 font-medium text-sm">
            {vendorProfile?.address || "-"}
          </div>
          <div className="text-n-6 text-sm mt-0.5">
            {[vendorProfile?.city, vendorProfile?.state, vendorProfile?.country]
              .filter(Boolean)
              .join(", ")}
          </div>
        </div>

        <div>
          <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
            Phone
          </div>
          <div className="text-n-8 font-medium text-sm">
            {vendorProfile?.phoneNumber || authUser?.phoneNumber || "-"}
          </div>
        </div>

        <div>
          <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
            Email
          </div>
          <div className="text-n-8 font-medium text-sm break-all">
            {vendorProfile?.email || authUser?.email || "-"}
          </div>
        </div>
        <div>
          <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
            School
          </div>
          <div className="text-n-8 font-medium text-sm">
            {vendorProfile?.schoolName|| authUser?.schoolName || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
