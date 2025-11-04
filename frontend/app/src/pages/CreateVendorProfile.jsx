import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Loader } from "../components/Loader";

export default function CreateVendorProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: "",
    storeUsername: "",
    storeDescription: "",
    businessCategory: "",
    phoneNumber: "",
    whatsAppNumber: "",
    email: "",
    profileImage: "",
    coverImage: "",
    gallery: "",
    address: "",
    city: "",
    state: "",
    country: "",
    mapLocationLat: "",
    mapLocationLng: "",
    accountNumber: "",
    paymentMethods: [],
    instagram: "",
    facebook: "",
    twitter: "",
    notifications: true,
    autoReply: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentOptions = [
    { id: "bank_transfer", label: "Bank transfer" },
    { id: "paypal", label: "PayPal" },
    { id: "credit_card", label: "Credit / Debit" },
  ];

  function togglePayment(method) {
    setForm((f) => {
      const exists = f.paymentMethods.includes(method);
      return {
        ...f,
        paymentMethods: exists
          ? f.paymentMethods.filter((m) => m !== method)
          : [...f.paymentMethods, method],
      };
    });
  }

  function validate() {
    if (!form.businessName.trim()) return "Business name is required";
    if (!form.storeUsername.trim()) return "Store username is required";
    if (!form.phoneNumber.trim()) return "Phone number is required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    setIsSubmitting(true);

    const payload = {
      businessName: form.businessName,
      storeUsername: form.storeUsername,
      storeDescription: form.storeDescription,
      businessCategory: form.businessCategory,
      phoneNumber: form.phoneNumber,
      whatsAppNumber: form.whatsAppNumber,
      email: form.email,
      profileImage: form.profileImage,
      coverImage: form.coverImage,
      gallery: form.gallery
        ? form.gallery
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      mapLocation:
        form.mapLocationLat || form.mapLocationLng
          ? { lat: form.mapLocationLat, lng: form.mapLocationLng }
          : null,
      accountNumber: form.accountNumber,
      paymentMethods: form.paymentMethods,
      socialLinks: {
        instagram: form.instagram,
        facebook: form.facebook,
        twitter: form.twitter,
      },
      settings: {
        notifications: !!form.notifications,
        autoReply: !!form.autoReply,
      },
    };

    try {
      // Backend route is mounted at /api/v1/vendorProfile (see backend/app.js)
      // create endpoint is POST /createVendorProfile
      const res = await api.post(
        "/api/v1/vendorProfile/createVendorProfile",
        payload
      );
      toast.success("Profile created");
      // Navigate to the newly created store page if we have a username
      if (form.storeUsername) navigate(`/vendor/${form.storeUsername}`);
      else navigate(`/vendor/me`);
    } catch (e) {
      const msg =
        e?.response?.data?.message || e.message || "Failed to create profile";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
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
                  value={form.businessName}
                  onChange={(e) =>
                    setForm({ ...form, businessName: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Store username
                </label>
                <input
                  value={form.storeUsername}
                  onChange={(e) =>
                    setForm({ ...form, storeUsername: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={form.storeDescription}
                onChange={(e) =>
                  setForm({ ...form, storeDescription: e.target.value })
                }
                className="w-full mt-1 border rounded px-3 py-2"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                value={form.businessCategory}
                onChange={(e) =>
                  setForm({ ...form, businessCategory: e.target.value })
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
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">WhatsApp</label>
                <input
                  value={form.whatsAppNumber}
                  onChange={(e) =>
                    setForm({ ...form, whatsAppNumber: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Location</h2>
            <div>
              <label className="block text-sm font-medium">School Name</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="State"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="Country"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">School Area</label>
                <input
                  value={form.mapLocationLat}
                  onChange={(e) =>
                    setForm({ ...form, mapLocationLat: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Zip code</label>
                <input
                  value={form.mapLocationLng}
                  onChange={(e) =>
                    setForm({ ...form, mapLocationLng: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>
          </section>

 

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Payments & bank</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {paymentOptions.map((p) => (
                <label className="inline-flex items-center gap-2" key={p.id}>
                  <input
                    type="checkbox"
                    checked={form.paymentMethods.includes(p.id)}
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
                value={form.accountNumber}
                onChange={(e) =>
                  setForm({ ...form, accountNumber: e.target.value })
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Social & settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
                placeholder="Instagram"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                placeholder="Facebook"
                className="w-full mt-1 border rounded px-3 py-2"
              />
              <input
                value={form.twitter}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                placeholder="Twitter"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>
 
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-3 text-white rounded"
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
