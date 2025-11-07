import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader } from "../components/Loader";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { InputField } from "../components/InputField";

export default function CreateVendorProfile() {
  const navigate = useNavigate();
  const profileData = useVendorProfileStore((state) => state.profileData);
  const setProfileField = useVendorProfileStore(
    (state) => state.setProfileField
  );
  const resetProfileData = useVendorProfileStore(
    (state) => state.resetProfileData
  );
  const createVendorProfile = useVendorProfileStore(
    (state) => state.createVendorProfile
  );
  const isCreatingProfile = useVendorProfileStore(
    (state) => state.isCreatingProfile
  );

  useEffect(() => {
    console.log(profileData);
  }, [profileData]);

  const handleInputChange = (field) => (e) => {
    setProfileField(field, e.target.value);
  };

  const isSubmitting = !!isCreatingProfile;

  const paymentOptions = [
    { id: "bank_transfer", label: "Bank transfer" },
    { id: "paystack", label: "paystack" },
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

    try {
      await createVendorProfile(profileData);
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
              <InputField
                onChange={handleInputChange("businessName")}
                label="Business name"
                value={profileData.businessName}
              />
              <InputField
                label="Store name"
                value={profileData.storeUsername}
                onChange={handleInputChange("storeUsername")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={profileData.storeDescription}
                onChange={handleInputChange("storeDescription")}
                className="w-full mt-1 border rounded px-3 py-2"
                rows={4}
              />
            </div>

            <InputField
              label="Category"
              value={profileData.category}
              onChange={handleInputChange("category")}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Phone number"
                value={profileData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
              <InputField
                label="WhatsApp number"
                value={profileData.whatsAppNumber}
                onChange={handleInputChange("whatsAppNummber")}
              />
            </div>
            <InputField
              label="Email"
              value={profileData.email}
              onChange={handleInputChange("email")}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Location</h2>
            <InputField
              label="Address"
              value={profileData.address}
              onChange={handleInputChange("address")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* No label here */}
              <InputField
                placeholder="City"
                value={profileData.city}
                onChange={handleInputChange("city")}
              />
              <InputField
                placeholder="State"
                value={profileData.state}
                onChange={handleInputChange("state")}
              />
              <InputField
                placeholder="Country"
                value={profileData.country}
                onChange={handleInputChange("country")}
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

            <InputField
              label="Account number"
              onChange={handleInputChange("accountNumber")}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Social & settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField
                placeholder="Instagram"
                onChange={handleInputChange("instagram")}
              />
              <InputField
                placeholder="Twitter"
                onChange={handleInputChange("twitter")}
              />
              <InputField
                placeholder="Facebook"
                onChange={handleInputChange("facebook")}
              />
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
              className="px-4 py-2 bg-primary-600 text-white bg-primary-3 rounded"
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
