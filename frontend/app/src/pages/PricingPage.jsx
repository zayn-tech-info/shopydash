import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useSubscriptionStore } from "../store/subscriptionStore";
import { plans } from "../constants/index";
import toast from "react-hot-toast";

const PricingPage = () => {
  const { authUser } = useAuthStore();
  const { initializePayment, initializingPlan, verifyPayment } =
    useSubscriptionStore();
  const { checkAuth } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");

    if (reference) {
 
      window.history.replaceState({}, document.title, window.location.pathname);

      const verify = async () => {
        try {
          await verifyPayment(reference);
          await checkAuth();
          toast.success("Payment successful! Your plan is now active.");

          const updatedUser = useAuthStore.getState().authUser;
          if (updatedUser?.username) {
            navigate(`/p/${updatedUser.username}`);
          } else {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error(error);
          toast.error(
            "Could not verify payment status. Please contact support."
          );
        }
      };

      verify();
    }
  }, [navigate, verifyPayment, checkAuth]);

  const handleSubscribe = async (planSlug) => {
    if (!authUser) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }
    await initializePayment(planSlug);
  };

  return (
    <div className="bg-n-1/50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-primary-3 font-bold tracking-widest uppercase text-sm mb-3">
            Premium Plans
          </h2>
          <h1 className="text-4xl md:text-5xl font-extrabold text-n-6 mb-6 tracking-tight">
            Supercharge Your Sales
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-n-4 leading-relaxed">
            Choose the perfect plan to grow your business, reach more students,
            and build a professional brand on Vendors.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-8 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col items-stretch h-full p-1 bg-white rounded-3xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${
                plan.popular
                  ? "shadow-xl ring-2 ring-primary-3"
                  : "shadow-lg border border-n-3"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 -mt-4 flex justify-center">
                  <span className="bg-primary-3 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-3 rounded-2xl ${
                      plan.popular
                        ? "bg-primary-3/10 text-primary-3"
                        : "bg-n-2/30 text-n-6"
                    }`}
                  >
                    <plan.icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-n-6">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <p className="text-n-4 text-sm leading-relaxed min-h-[48px]">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline">
                  <span className="text-4xl font-extrabold text-n-7 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-n-4 ml-1 font-medium">
                    {plan.period}
                  </span>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      </div>
                      <p className="ml-3 text-sm text-n-5 font-medium leading-5">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 shadow-md transform active:scale-95 flex items-center justify-center ${
                    plan.popular
                      ? "bg-primary-3 text-white hover:bg-primary-4 hover:shadow-primary-3/25"
                      : "bg-n-7 text-white hover:bg-n-8"
                  } ${
                    initializingPlan === plan.slug
                      ? "opacity-100 cursor-wait"
                      : initializingPlan
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => handleSubscribe(plan.slug)}
                  disabled={!!initializingPlan}
                >
                  {initializingPlan === plan.slug ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-n-4 mb-4">
            Need help choosing?{" "}
            <a
              href="#"
              className="text-primary-3 font-semibold hover:underline"
            >
              Contact our support
            </a>
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-n-4 opacity-70">
            <span className="flex items-center">
              <Check size={14} className="mr-1" /> Secure Payment
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Check size={14} className="mr-1" /> Cancel Anytime
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
