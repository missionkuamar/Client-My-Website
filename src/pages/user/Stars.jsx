import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchPlans,
  createOrder,
  verifyPayment,
  clearPaymentError,
} from "../../features/payment/paymentSlice";
import { updateStars } from "../../features/auth/authSlice";
import {
  Star,
  Check,
  ShieldCheck,
  Zap,
  Gift,
  Lock,
  Sparkles,
  Crown,
} from "lucide-react";

/* ---------- Plan icon mapping ---------- */
const planIcons = {
  silver: Star,
  gold: Crown,
  platinum: Sparkles,
};

const Stars = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { plans = [], processing, error } = useSelector((s) => s.payment);
  const { user } = useSelector((s) => s.auth);
  const [buyingId, setBuyingId] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch plans ---------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await dispatch(fetchPlans());
      setLoading(false);
    };
    load();
    return () => dispatch(clearPaymentError());
  }, [dispatch]);

  /* ---------- Handle Buy ---------- */
  const handleBuy = async (plan) => {
    setBuyingId(plan.id);
    const toastId = toast.loading(`Opening checkout for ${plan.name}...`);

    try {
      // 1. Create order
      const orderRes = await dispatch(createOrder(plan.id)).unwrap();
      toast.dismiss(toastId);

      // 2. Razorpay checkout
      const options = {
        key: orderRes.key,
        amount: orderRes.order.amount,
        currency: orderRes.order.currency,
        name: "Your Store",
        description: `${plan.name} Plan - ${plan.stars} Stars`,
        order_id: orderRes.order.id,
        handler: async (response) => {
          const verifyToastId = toast.loading("Verifying payment...");
          try {
            const verifyRes = await dispatch(
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            dispatch(updateStars(verifyRes.newBalance));
            toast.success(
              `🎉 ${verifyRes.starsAdded} stars added to your wallet!`,
              { id: verifyToastId, duration: 4000 }
            );
            setTimeout(() => navigate("/user/dashboard"), 1500);
          } catch (err) {
            toast.error(err || "Verification failed", { id: verifyToastId });
          } finally {
            setBuyingId(null);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: () => {
            setBuyingId(null);
            toast.dismiss(toastId);
            toast.error("Checkout cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err || "Failed to create order", { id: toastId });
      setBuyingId(null);
    }
  };

  /* ---------- Loading skeleton ---------- */
  if (loading && plans.length === 0) {
    return (
      <>
        <div className="mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            ⭐ Buy Stars
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            Top up your star balance and unlock premium projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-20 mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-24 mx-auto mb-6"></div>
              <div className="h-20 bg-gray-100 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </>
    );
  }

  /* ==================== MAIN ==================== */
  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          ⭐ Buy Stars
        </h1>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          Top up your balance and unlock premium projects instantly
        </p>
      </div>

      {/* ==================== BALANCE HERO ==================== */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-2xl shadow-lg p-5 sm:p-6 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm opacity-90">Current Star Balance</p>
            <p className="text-3xl sm:text-4xl font-bold mt-1">
              ⭐ {user?.stars ?? 0}
            </p>
            <p className="text-xs sm:text-sm opacity-90 mt-1">
              Ready to spend on premium projects
            </p>
          </div>
          <Link
            to="/projects"
            className="bg-white/20 backdrop-blur hover:bg-white/30 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition border border-white/20 w-full sm:w-auto text-center"
          >
            🛍️ Browse Projects
          </Link>
        </div>
      </div>

      {/* ==================== ERROR ==================== */}
      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span className="break-words">{error}</span>
        </div>
      )}

      {/* ==================== PLANS GRID ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-6">
        {plans.map((plan) => {
          const Icon = planIcons[plan.id] || Star;
          const isPopular = plan.popular;
          const isBuying = buyingId === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 transition-all duration-300 flex flex-col ${
                isPopular
                  ? "border-indigo-500 shadow-xl md:scale-105 z-10"
                  : "border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300"
              }`}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap flex items-center gap-1">
                  <Sparkles size={12} /> MOST POPULAR
                </div>
              )}

              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                {/* Icon + Name */}
                <div className="text-center mb-5">
                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                      isPopular
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <p
                    className={`text-4xl sm:text-5xl font-bold ${
                      isPopular ? "text-indigo-600" : "text-gray-800"
                    }`}
                  >
                    ₹{plan.price}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">one-time payment</p>
                </div>

                {/* Stars box */}
                <div
                  className={`rounded-xl p-4 text-center mb-5 ${
                    isPopular
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200"
                      : "bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star
                      size={24}
                      className="fill-yellow-500 text-yellow-500"
                    />
                    <p className="text-3xl font-bold text-yellow-600">
                      {plan.stars}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">stars</p>
                  {plan.bonus > 0 && (
                    <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center justify-center gap-1">
                      <Gift size={12} /> +{plan.bonus} bonus stars!
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 text-xs sm:text-sm text-gray-600 mb-5 flex-1">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 flex-shrink-0" />
                    Instant credit
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 flex-shrink-0" />
                    Never expires
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 flex-shrink-0" />
                    Buy any project
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-600 flex-shrink-0" />
                    Lifetime access
                  </li>
                </ul>

                {/* Buy button */}
                <button
                  onClick={() => handleBuy(plan)}
                  disabled={processing || isBuying}
                  className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPopular
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {isBuying ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> Buy for ₹{plan.price}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== TRUST BADGES ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Secure Payment</p>
            <p className="text-xs text-gray-500">256-bit encryption</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Instant Credit</p>
            <p className="text-xs text-gray-500">Stars in seconds</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Never Expires</p>
            <p className="text-xs text-gray-500">Use anytime</p>
          </div>
        </div>
      </div>

      {/* ==================== FOOTER INFO ==================== */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Lock
            size={18}
            className="text-blue-600 mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Secure payments powered by Razorpay
            </p>
            <p className="text-xs sm:text-sm text-blue-800 mt-1">
              UPI · Credit/Debit Cards · Netbanking · Wallets accepted. All
              transactions are encrypted and PCI-DSS compliant.
            </p>
          </div>
        </div>
      </div>

      {/* ==================== HELP LINK ==================== */}
      <div className="mt-5 text-center text-xs sm:text-sm text-gray-500">
        Having trouble?{" "}
        <Link
          to="/user/settings"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Contact support
        </Link>
      </div>
    </>
  );
};

export default Stars;