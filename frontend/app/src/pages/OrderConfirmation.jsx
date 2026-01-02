import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/axios";
import {
  CheckCircle,
  XCircle,
  Loader,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState("verifying"); 
  const { clearCart } = useCartStore();

  useEffect(() => {
    if (!reference) {
      navigate("/");
      return;
    }

    const verifyOrder = async () => {
      try {
        const res = await api.get(
          `/api/v1/payment/verify?reference=${reference}`
        );
        if (res.data.success) {
          setStatus("success");
          clearCart();  
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus("failed");
      }
    };

    verifyOrder();
  }, [reference, navigate, clearCart]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Loader className="w-16 h-16 text-orange-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">
          Verifying Payment...
        </h2>
        <p className="text-gray-500">
          Please wait while we confirm your order.
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          We couldn't confirm your payment. If you have been debited, please
          contact support.
        </p>
        <div className="flex gap-4">
          <Link
            to="/cart"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Return to Cart
          </Link>
          <a
            href="mailto:support@shopydash.com"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Successful!
        </h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. Your funds are held securely in Escrow
          until you confirm delivery.
        </p>

        <div className="bg-orange-50 rounded-xl p-4 mb-8 text-left">
          <h3 className="font-semibold text-orange-900 mb-1 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> What happens next?
          </h3>
          <ul className="text-sm text-orange-800 space-y-2 list-disc list-inside">
            <li>Vendor verifies your order.</li>
            <li>You meet/receive the product.</li>
            <li>You check "My Orders" and confirm delivery.</li>
            <li>Vendor gets paid.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            to="/orders"
            className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
          >
            View My Orders <ArrowRight size={18} />
          </Link>
          <Link
            to="/feeds"
            className="block w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
