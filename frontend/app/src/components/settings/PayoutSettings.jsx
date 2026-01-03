import React, { useState, useEffect } from "react";
import SearchableDropdown from "../common/SearchableDropdown";
import { api } from "../../lib/axios";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Building,
  CheckCircle,
  AlertCircle,
  Loader,
  BadgeDollarSign,
} from "lucide-react";

export function PayoutSettings({ user }) {
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  const [formData, setFormData] = useState({
    bankCode: "",
    accountNumber: "",
    accountName: "",
  });

  const [resolving, setResolving] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetchBanks();
    fetchVendorProfile();
  }, [user]);

  const fetchBanks = async () => {
    try {
      const res = await api.get("/api/v1/payment/banks");
      if (res.data.success) {
        setBanks(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Banks Error:", error);
      toast.error("Could not load banks");
    } finally {
      setLoadingBanks(false);
    }
  };

  const fetchVendorProfile = async () => {
    if (!user?._id) return;
    try {
      setLoadingProfile(true);
      // We need to fetch the vendor profile which contains bankDetails
      // Assuming GET /api/v1/vendorProfile/:id returns the profile
      // Or we can get it from the user store if it includes vendor details
      const res = await api.get(`/api/v1/vendorProfile/${user._id}`);
      if (res.data.success) {
        const profile = res.data.data;
        if (profile && profile.bankDetails) {
          setFormData({
            bankCode: profile.bankDetails.bankCode || "",
            accountNumber: profile.bankDetails.accountNumber || "",
            accountName: profile.bankDetails.accountName || "",
          });
          if (profile.bankDetails.accountName) {
            setIsVerified(true);
          }
        }
      }
    } catch (error) {
      //   console.error("Fetch Profile Error:", error);
      // It's possible the profile doesn't exist yet or just no bank details
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAccountResolve = async () => {
    if (!formData.bankCode || formData.accountNumber.length !== 10) {
      return toast.error(
        "Select a bank and enter a valid 10-digit account number"
      );
    }

    setResolving(true);
    setIsVerified(false);
    setFormData((prev) => ({ ...prev, accountName: "" }));

    try {
      const res = await api.get(
        `/api/v1/payment/resolve-account?account_number=${formData.accountNumber}&bank_code=${formData.bankCode}`
      );
      if (res.data.success) {
        setFormData((prev) => ({
          ...prev,
          accountName: res.data.data.account_name,
        }));
        setIsVerified(true);
        toast.success("Account verified successfully");
      }
    } catch (error) {
      console.error("Resolve Error:", error);
      toast.error("Could not verify account details");
      setIsVerified(false);
    } finally {
      setResolving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      return toast.error("Please verify your account details first");
    }

    setSaving(true);
    try {
      const payload = {
        business_name: formData.accountName,
        settlement_bank: formData.bankCode,
        account_number: formData.accountNumber,
        percentage_charge: 5,
      };

      const res = await api.post("/api/v1/payment/subaccount", payload);

      if (res.data.success) {
        toast.success("Bank details saved successfully!");
      }
    } catch (error) {
      console.error("Save Bank Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to save bank details"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingBanks || loadingProfile) {
    return (
      <div className="p-8 text-center text-n-4">Loading payout settings...</div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-n-8 flex items-center gap-2">
          <BadgeDollarSign className="text-primary-3" />
          Payout Settings
        </h2>
        <p className="text-n-4 mt-1">
          Connect your bank account to receive payments automatically.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-semibold mb-1">How payouts work</p>
          <p>
            Your earnings are automatically processed to this account 24 hours
            after an order is marked as delivered by the customer.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <SearchableDropdown
          label="Select Bank"
          value={formData.bankCode}
          onChange={(val) => {
            setFormData({
              ...formData,
              bankCode: val,
              accountName: "",
            });
            setIsVerified(false);
          }}
          options={banks}
          loading={loadingBanks}
          placeholder="Search and select your bank..."
          displayKey="name"
          valueKey="code"
        />

        <div>
          <label className="block text-sm font-medium text-n-6 mb-2">
            Account Number
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={10}
              value={formData.accountNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setFormData({
                  ...formData,
                  accountNumber: val,
                  accountName: "",
                });
                setIsVerified(false);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-n-3 rounded-xl text-n-8 focus:outline-none focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 transition-all font-mono tracking-wider"
              placeholder="0123456789"
            />
            <CreditCard
              className="absolute left-3 top-1/2 -translate-y-1/2 text-n-4"
              size={18}
            />
          </div>
        </div>

        {!isVerified && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAccountResolve}
              disabled={
                resolving ||
                !formData.bankCode ||
                formData.accountNumber.length !== 10
              }
              className="px-6 py-2 bg-n-2 text-n-8 font-bold rounded-lg hover:bg-n-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {resolving ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Account"
              )}
            </button>
          </div>
        )}

        {isVerified && (
          <div className="rounded-xl bg-green-50 p-4 border border-green-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-green-800">
                Account Verified
              </h4>
              <p className="mt-1 text-lg font-bold text-green-900">
                {formData.accountName}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Please confirm this is your account before saving.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-n-3/20">
          <button
            type="submit"
            disabled={saving || !isVerified}
            className="flex items-center justify-center w-full md:w-auto px-8 py-3 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-3/90 transition-all disabled:opacity-70 shadow-lg shadow-primary-3/20 transform active:scale-95"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Saving Details...
              </span>
            ) : (
              "Save Bank Details"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
