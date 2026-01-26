export function ClientAddress({ clientProfile, authUser, className }) {
  return (
    <div>
      <div
        className={`mt-6 bg-white rounded-lg border border-gray-100 p-5 text-sm space-y-4 ${className}`}
      >
        <div>
          <div className="font-medium text-sm">School Area</div>
          <div className="mt-1 text-primary-4 text-base">
            {authUser?.schoolArea ||
              "-"}
          </div>
        </div>

        <div>
          <div className="font-medium text-sm">Phone</div>
          <div className="text-primary-4 mt-1">
            {clientProfile?.userId?.phoneNumber || authUser?.phoneNumber || "-"}
          </div>
        </div>

        <div>
          <div className="font-medium text-sm">Email</div>
          <div className="text-primary-4 mt-1">
            {clientProfile?.userId?.email || authUser?.email || "-"}
          </div>
        </div>
        <div>
          <div className="font-medium text-sm">School</div>
          <div className="text-primary-4 mt-1">
            {clientProfile?.userId?.schoolName || authUser?.schoolName || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
