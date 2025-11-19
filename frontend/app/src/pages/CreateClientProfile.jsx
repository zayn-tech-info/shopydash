import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader } from "../components/Loader";
import { useClientProfileStore } from "../store/clientProfileStore";
import { useAuthStore } from "../store/authStore";
import { InputField } from "../components/InputField";

export default function CreateClientProfile() {
  const navigate = useNavigate();
  const clientProfileData = useClientProfileStore(
    (state) => state.clientProfileData
  );
  const setInputField = useClientProfileStore((state) => state.setInputField);
  const resetInputField = useClientProfileStore(
    (state) => state.resetInputField
  );
  const createClientProfile = useClientProfileStore(
    (state) => state.createClientProfile
  );
  const { authUser, updateUser } = useAuthStore();
  const loading = useClientProfileStore((state) => state.loading);

  useEffect(() => {
    console.log(clientProfileData);
  }, [clientProfileData]);

  const handleInputChange = (field) => (e) => {
    setInputField(field, e.target.value);
  };

  function validate() {
    if (!clientProfileData.fullName || !clientProfileData.fullName.trim())
      return "Full name is required";
    if (!clientProfileData.username || !clientProfileData.username.trim())
      return "Username is required";
    if (!clientProfileData.phoneNumber || !clientProfileData.phoneNumber.trim())
      return "Phone number is required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      await createClientProfile(clientProfileData);
      updateUser({ hasProfile: true });
      toast.success("Profile created");
      if (authUser?.role === "vendor") {
        navigate("/vendor/profile");
      } else {
        navigate("/profile");
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message || e.message || "Failed to create profile";
      toast.error(msg);
    }
  }

  return (
    <main className="py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Complete your profile</h1>
        <p className="text-sm text-n-7 mb-6">
          Fill in the details below to complete your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-medium">Basic information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                onChange={handleInputChange("fullName")}
                label="Full Name"
                value={clientProfileData.fullName}
              />
              <InputField
                label="Username"
                value={clientProfileData.username}
                onChange={handleInputChange("username")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="School Name"
                value={clientProfileData.schoolName}
                onChange={handleInputChange("schoolName")}
              />
              <InputField
                label="Preferred Category"
                value={clientProfileData.preferredCategory}
                onChange={handleInputChange("preferredCategory")}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Phone number"
                value={clientProfileData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Location</h2>
            <InputField
              label="Address"
              value={clientProfileData.address}
              onChange={handleInputChange("address")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InputField
                placeholder="City"
                value={clientProfileData.city}
                onChange={handleInputChange("city")}
              />
              <InputField
                placeholder="State"
                value={clientProfileData.state}
                onChange={handleInputChange("state")}
              />
              <InputField
                placeholder="Country"
                value={clientProfileData.country}
                onChange={handleInputChange("country")}
              />
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetInputField();
                navigate(-1);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white bg-primary-3 rounded"
              disabled={loading}
            >
              {loading ? <Loader>Creating...</Loader> : "Create profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
