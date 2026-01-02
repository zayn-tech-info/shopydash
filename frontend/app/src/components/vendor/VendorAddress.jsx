import { MapPin } from "lucide-react";

export function VendorAddress({ vendorProfile }) {
  if (!vendorProfile || !vendorProfile.userId) return null;

  const { city, state, country, schoolArea, area } = vendorProfile.userId;

  const addressParts = [schoolArea, area, city, state, country].filter(Boolean);

  if (addressParts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="h5 text-n-8">Location</h3>
      <div className="flex items-start gap-4 p-4 bg-n-2/30 rounded-xl border border-n-3/20">
        <div className="p-2 bg-white rounded-lg shadow-sm border border-n-3/20">
          <MapPin className="text-primary-3" size={24} />
        </div>
        <div>
          <div className="text-n-8 font-medium">{addressParts.join(", ")}</div>
          <div className="text-sm text-n-4 mt-1">
            Vendor's primary operating location
          </div>
        </div>
      </div>
    </div>
  );
}
