import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";
import {
  CreditCard,
  Building,
  User,
  CheckCircle,
  AlertCircle,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function VendorBankSettings() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
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
  const [existingDetails, setExistingDetails] = useState(null);

  useEffect(() => {
    fetchBanks();
    fetchVendorProfile();
  }, []);

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
    try {
      
      
      
      const res = await api.get(`/api/v1/vendorProfile/${authUser._id}`); 
      
      
      
      

      

      
      if (authUser && authUser.vendorProfile) {
        
      }
    } catch (error) {
      
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
      
      const selectedBank = banks.find((b) => b.code === formData.bankCode);

      const payload = {
        business_name: formData.accountName, 
        settlement_bank: formData.bankCode,
        account_number: formData.accountNumber,
        percentage_charge: 5, 
      };

      const res = await api.post("/api/v1/payment/subaccount", payload);

      if (res.data.success) {
        toast.success("Bank details saved successfully!");
        navigate("/dashboard");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Payout Settings</h2>
                <p className="text-orange-100 mt-1">
                  Connect your bank account to receive payments
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Bank
              </label>
              <div className="relative">
                <select
                  value={formData.bankCode}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      bankCode: e.target.value,
                      accountName: "",
                    });
                    setIsVerified(false);
                  }}
                  className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-xl border bg-gray-50"
                  disabled={loadingBanks}
                >
                  <option value="">
                    {loadingBanks ? "Loading banks..." : "Choose your bank"}
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  {loadingBanks && (
                    <Loader className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
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
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border bg-gray-50"
                  placeholder="0123456789"
                />
              </div>
            </div>

            {}
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
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resolving ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Account"
                  )}
                </button>
              </div>
            )}

            {}
            {isVerified && (
              <div className="rounded-xl bg-green-50 p-4 border border-green-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    Account Verified
                  </h4>
                  <p className="mt-1 text-lg font-semibold text-green-900">
                    {formData.accountName}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Please confirm this is your account before saving.
                  </p>
                </div>
              </div>
            )}

            {}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving || !isVerified}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Saving Details...
                  </>
                ) : (
                  "Save Bank Details"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 flex items-start gap-4 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            Your payouts are processed automatically to this account 24 hours
            after an order is marked as delivered by the customer.
          </p>
        </div>
      </div>
    </div>
  );
}
