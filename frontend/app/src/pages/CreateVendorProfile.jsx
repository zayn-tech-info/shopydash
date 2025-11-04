import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader } from "../components/Loader";
import { useVendorProfileStore } from "../store/vendorProfileStore";

export default function CreateVendorProfile() {
  const navigate = useNavigate();
  const {
    profileData,
    setProfileField,
    resetProfileData,
    createVendorProfile,
    isCreatingProfile,
  } = useVendorProfileStore();

  const isSubmitting = !!isCreatingProfile;

  const paymentOptions = [
    { id: "bank_transfer", label: "Bank transfer" },
    { id: "paypal", label: "PayPal" },
    { id: "credit_card", label: "Credit / Debit" },
  ];

  function togglePayment(method) {
    const current = profileData.paymentMethods || [];
    const exists = current.includes(method);
    setProfileField(
      "paymentMethods",
      exists ? current.filter((m) => m !== method) : [...current, method]
    );
  }

  function validate() {
    if (!profileData.businessName || !profileData.businessName.trim())
      return "Business name is required";
    if (!profileData.storeUsername || !profileData.storeUsername.trim())
      return "Store username is required";
    if (!profileData.phoneNumber || !profileData.phoneNumber.trim())
      return "Phone number is required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    const payload = {
      businessName: profileData.businessName,
      storeUsername: profileData.storeUsername,
      storeDescription: profileData.storeDescription,
      businessCategory: profileData.businessCategory,
      phoneNumber: profileData.phoneNumber,
      whatsAppNumber: profileData.whatsAppNumber,
      email: profileData.email,
      profileImage: profileData.profileImage,
      coverImage: profileData.coverImage,
      gallery: profileData.gallery
        ? profileData.gallery
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      country: profileData.country,
      mapLocation:
        profileData.mapLocationLat || profileData.mapLocationLng
          ? { lat: profileData.mapLocationLat, lng: profileData.mapLocationLng }
          : null,
      accountNumber: profileData.accountNumber,
      paymentMethods: profileData.paymentMethods || [],
      socialLinks: {
        instagram: profileData.instagram,
        facebook: profileData.facebook,
        twitter: profileData.twitter,
      },
      settings: {
        notifications: !!profileData.notifications,
        autoReply: !!profileData.autoReply,
      },
    };

    try {
      await createVendorProfile(payload);
      toast.success("Profile created");
      if (profileData.storeUsername)
        navigate(`/vendor/${profileData.storeUsername}`);
      else navigate(`/vendor/me`);
    } catch (e) {
      const msg =
        e?.response?.data?.message || e.message || "Failed to create profile";
      toast.error(msg);
    }
  }

  return (
    <main className="py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Create your store profile
        </h1>
        <p className="text-sm text-n-7 mb-6">
          Fill in the details below so customers can find your store.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-medium">Basic information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">
                  Business name
                </label>
                <input
                  value={profileData.businessName}
                  onChange={(e) =>
                    setProfileField("businessName", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Store username
                </label>
                <input
                  value={profileData.storeUsername}
                  onChange={(e) =>
                    setProfileField("storeUsername", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={profileData.storeDescription}
                onChange={(e) =>
                  setProfileField("storeDescription", e.target.value)
                }
                className="w-full mt-1 border rounded px-3 py-2"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                value={profileData.businessCategory}
                onChange={(e) =>
                  setProfileField("businessCategory", e.target.value)
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  value={profileData.phoneNumber}
                  onChange={(e) =>
                    setProfileField("phoneNumber", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">WhatsApp</label>
                <input
                  value={profileData.whatsAppNumber}
                  onChange={(e) =>
                    setProfileField("whatsAppNumber", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                value={profileData.email}
                onChange={(e) => setProfileField("email", e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Location</h2>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                value={profileData.address}
                onChange={(e) => setProfileField("address", e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={profileData.city}
                onChange={(e) => setProfileField("city", e.target.value)}
                placeholder="City"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={profileData.state}
                onChange={(e) => setProfileField("state", e.target.value)}
                placeholder="State"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={profileData.country}
                onChange={(e) => setProfileField("country", e.target.value)}
                placeholder="Country"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Map lat</label>
                <input
                  value={profileData.mapLocationLat || ""}
                  onChange={(e) =>
                    setProfileField("mapLocationLat", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Map lng</label>
                <input
                  value={profileData.mapLocationLng || ""}
                  onChange={(e) =>
                    setProfileField("mapLocationLng", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Media</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">
                  Profile image (URL)
                </label>
                <input
                  value={profileData.profileImage}
                  onChange={(e) =>
                    setProfileField("profileImage", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Cover image (URL)
                </label>
                <input
                  value={profileData.coverImage}
                  onChange={(e) =>
                    setProfileField("coverImage", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Gallery (comma-separated URLs)
              </label>
              <input
                value={profileData.gallery}
                onChange={(e) => setProfileField("gallery", e.target.value)}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Payments & bank</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {paymentOptions.map((p) => (
                <label className="inline-flex items-center gap-2" key={p.id}>
                  <input
                    type="checkbox"
                    checked={(profileData.paymentMethods || []).includes(p.id)}
                    onChange={() => togglePayment(p.id)}
                  />
                  <span className="text-sm">{p.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Account number
              </label>
              <input
                value={profileData.accountNumber}
                onChange={(e) =>
                  setProfileField("accountNumber", e.target.value)
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Social & settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={profileData.instagram}
                onChange={(e) => setProfileField("instagram", e.target.value)}
                placeholder="Instagram"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={profileData.facebook}
                onChange={(e) => setProfileField("facebook", e.target.value)}
                placeholder="Facebook"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={profileData.twitter}
                onChange={(e) => setProfileField("twitter", e.target.value)}
                placeholder="Twitter"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!profileData.notifications}
                  onChange={(e) =>
                    setProfileField("notifications", e.target.checked)
                  }
                />
                <span className="text-sm">Enable notifications</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!profileData.autoReply}
                  onChange={(e) =>
                    setProfileField("autoReply", e.target.checked)
                  }
                />
                <span className="text-sm">Auto-reply customers</span>
              </label>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetProfileData();
                navigate(-1);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader>Creating...</Loader> : "Create profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
