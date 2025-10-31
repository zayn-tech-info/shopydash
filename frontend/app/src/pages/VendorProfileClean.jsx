import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { Edit, Link2 } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useEffect } from "react";

export default function VendorProfileClean() {
  const { isGettingVendorProfile, vendorProfile, getVendorProfile } =
    useVendorProfileStore();

  function copyProfileLink() {
    const link = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(() => toast.success("Profile link copied"))
        .catch(() => fallbackCopy(link));
    } else {
      fallbackCopy(link);
    }
  }

  useEffect(() => {
    getVendorProfile();
    console.log(vendorProfile);
  }, [vendorProfile, getVendorProfile]);

  function fallbackCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Profile link copied");
    } catch (e) {
      toast.error("Could not copy link");
    }
  }

  if (isGettingVendorProfile)
    return (
      <div className="py-20">
        <div className="max-w-3xl mx-auto">loading Vendor profile</div>
      </div>
    );
  if (!vendorProfile)
    return (
      <div className="py-20">
        <div className="max-w-3xl mx-auto">Vendor not found.</div>
      </div>
    );

  return (
    <main className="py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6 relative">
          <div className="w-full h-40 sm:h-48 bg-n-3">
            {vendorProfile.coverImage ? (
              <img
                src={vendorProfile.coverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-3 to-primary-4 flex items-center justify-center">
                <span className="text-white font-semibold md:text-3xl text-base md:mb-5 mb-2">
                  {vendorProfile.businessName}
                </span>
              </div>
            )}
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={vendorProfile.profileImage || Logo}
                alt={vendorProfile.businessName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendorProfile.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {vendorProfile.active ? "Active" : "Inactive"}
            </span>
            <button
              onClick={copyProfileLink}
              className="px-3 py-3 rounded-full bg-n-1 text-sm text-n-10 hover:bg-n-2 transition-colors duration-500"
            >
              <Link2 />
            </button>
          </div>
        </div>

        <div className="text-center mt-8 px-4">
          <h2 className="text-xl sm:text-xl font-extrabol">
            @
            <a className="text-blue-700 font-medium" href="">
              {vendorProfile.storeUsername || vendorProfile.businessName}
            </a>
          </h2>
          <p className="text-sm text-n-6 mt-1">Member since Oct 2025</p>

          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-n-7">
            <div className="flex items-center gap-2">
              <span className="font-medium">0 followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">0 following</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button className="px-5 py-1 rounded-md bg-n-7  border-n-8 text-white text-sm font-medium">
              Follow
            </button>
            <button
              onClick={copyProfileLink}
              className="px-5 py-1 rounded-md border-n-8 text-n-9 border-2 text-sm font-medium"
            >
              Share
            </button>
            <button className="w-10 h-10 rounded-full border flex items-center justify-center">
              <Edit />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 mt-6">
          <div className="text-n-7 mb-6 text-center sm:text-left">
            {vendorProfile.storeDescription}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="text-sm text-n-7">
                  <h4 className="font-medium md:text-lg border-n-7 border-2 backdrop-blur-sm inline-block px-2 rounded mb-2">
                    Category
                  </h4>
                  <div className="mb-3">{vendorProfile.businessCategory}</div>

                  <div className="border-t border-gray-100 pt-3">
                    <h4 className="mb-2 md:text-lg text-base font-medium">
                      Contact
                    </h4>
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <dt className="w-28 sm:w-32 font-medium">Phone</dt>
                        <dd className="flex-1 text-primary-4 font-medium">
                          <a href={`tel:${vendorProfile.phoneNumber}`}>
                            {vendorProfile.phoneNumber}
                          </a>
                        </dd>
                      </div>

                      <div className="flex items-start">
                        <dt className="w-28 sm:w-32 font-medium">WhatsApp</dt>
                        <dd className="flex-1 text-primary-4 font-medium">
                          <a
                            href={`https://wa.me/${vendorProfile.whatsAppNumber?.replace(
                              /\D/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Message on WhatsApp
                          </a>
                        </dd>
                      </div>

                      {vendorProfile.email ? (
                        <div className="flex items-start">
                          <dt className="w-28 sm:w-32 font-medium">Email</dt>
                          <dd className="flex-1 text-primary-4 font-medium">
                            <a href={`mailto:${vendorProfile.email}`}>
                              {vendorProfile.email}
                            </a>
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <h4 className=" md:text-lg border-n-7 border-2 backdrop-blur-sm inline-block px-2 rounded mb-2">
                  Location
                </h4>
                <div className="text-sm text-n-7 mt-1 space-y-1">
                  <div>{vendorProfile.address}</div>
                  <div>
                    {vendorProfile.city}, {vendorProfile.state}
                  </div>
                  <div>{vendorProfile.country}</div>
                </div>

                {vendorProfile.mapLocation ? (
                  <div className="mt-3">
                    <iframe
                      title="vendorProfile-map"
                      src={`https://www.google.com/maps?q=${vendorProfile.mapLocation.lat},${vendorProfile.mapLocation.lng}&z=15&output=embed`}
                      className="w-full h-36 rounded-md border"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-medium md:text-lg border-n-7 border-2 backdrop-blur-sm inline-block px-2 rounded mb-2">
                Gallery
              </h3>
              {vendorProfile.gallery && vendorProfile.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {vendorProfile.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="w-full h-24 bg-n-3 rounded overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`gallery-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-sm text-n-6">
                  No gallery images yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
