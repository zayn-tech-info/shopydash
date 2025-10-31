import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { Copy, CopyCheckIcon, Edit, Link2 } from "lucide-react";

const sampleVendor = {
  userId: "12345",
  businessName: "Basit Wears",
  storeUsername: "basitwears",
  storeDescription:
    "We sell handcrafted, sustainable fashion for everyday comfort.",
  businessCategory: "Fashion",
  phone: "+92 300 0000000",
  whatsappNumber: "+92 300 0000000",
  email: "basit@example.com",
  address: "Shop 12, Market Street",
  city: "Lahore",
  state: "Punjab",
  country: "Pakistan",
  mapLocation: { lat: 31.5204, lng: 74.3587 },
  profileImage: null,
  coverImage: null,
  gallery: [],
  active: true,
};

export default function VendorProfileClean() {
  const { username } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchVendor() {
      setLoading(true);
      try {
        const res = await api.get(`/vendors/username/${username}`);
        if (!mounted) return;
        if (res?.data?.success && res.data.data?.vendorProfile) {
          setVendor(res.data.data.vendorProfile);
        } else if (res?.data?.success && res.data.data) {
          setVendor(res.data.data);
        } else {
          setVendor({
            ...sampleVendor,
            storeUsername: username || sampleVendor.storeUsername,
          });
        }
      } catch (err) {
        setVendor({
          ...sampleVendor,
          storeUsername: username || sampleVendor.storeUsername,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchVendor();
    return () => {
      mounted = false;
    };
  }, [username]);

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

  if (loading)
    return (
      <div className="py-20">
        <div className="max-w-3xl mx-auto">Loading vendor profile…</div>
      </div>
    );
  if (!vendor)
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
            {vendor.coverImage ? (
              <img
                src={vendor.coverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-3 to-primary-4 flex items-center justify-center">
                <span className="text-white font-semibold md:text-3xl text-base md:mb-5 mb-2">
                  {vendor.businessName}
                </span>
              </div>
            )}
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={vendor.profileImage || Logo}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendor.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {vendor.active ? "Active" : "Inactive"}
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
              {vendor.storeUsername || vendor.businessName}
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
            {vendor.storeDescription}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="text-sm text-n-7">
                  <h4 className="font-medium md:text-lg border-n-7 border-2 backdrop-blur-sm inline-block px-2 rounded mb-2">
                    Category
                  </h4>
                  <div className="mb-3">{vendor.businessCategory}</div>

                  <div className="border-t border-gray-100 pt-3">
                    <h4 className="font-medium mb-2">Contact</h4>
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <dt className="w-28 sm:w-32 font-medium">Phone</dt>
                        <dd className="flex-1 text-primary-4 font-medium">
                          <a href={`tel:${vendor.phone}`}>{vendor.phone}</a>
                        </dd>
                      </div>

                      <div className="flex items-start">
                        <dt className="w-28 sm:w-32 font-medium">WhatsApp</dt>
                        <dd className="flex-1 text-primary-4 font-medium">
                          <a
                            href={`https://wa.me/${vendor.whatsappNumber?.replace(
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

                      {vendor.email ? (
                        <div className="flex items-start">
                          <dt className="w-28 sm:w-32 font-medium">Email</dt>
                          <dd className="flex-1 text-primary-4 font-medium">
                            <a href={`mailto:${vendor.email}`}>
                              {vendor.email}
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
                  <div>{vendor.address}</div>
                  <div>
                    {vendor.city}, {vendor.state}
                  </div>
                  <div>{vendor.country}</div>
                </div>

                {vendor.mapLocation ? (
                  <div className="mt-3">
                    <iframe
                      title="vendor-map"
                      src={`https://www.google.com/maps?q=${vendor.mapLocation.lat},${vendor.mapLocation.lng}&z=15&output=embed`}
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
              {vendor.gallery && vendor.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {vendor.gallery.map((img, i) => (
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
