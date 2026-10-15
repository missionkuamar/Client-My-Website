import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GoogleButton from "../../components/auth/GoogleButton";
import { Gift, Zap, Star, Shield, Check } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);

  /* ---------- Redirect if already logged in ---------- */
  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/user/dashboard", { replace: true });
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-3xl mb-3 shadow-lg">
            🚀
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Start your journey in seconds
          </p>
        </div>

        {/* Welcome bonus banner */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center text-xl flex-shrink-0">
            🎁
          </div>
          <div>
            <p className="text-sm font-bold text-yellow-800">
              100 Free Stars
            </p>
            <p className="text-xs text-yellow-700">
              On sign up — start exploring instantly!
            </p>
          </div>
        </div>

        {/* Google Sign Up */}
        <GoogleButton text="signup_with" />

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">
            ONE-CLICK SIGN UP
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Perks */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
              <Gift size={16} />
            </div>
            <span>Get <strong>100 stars</strong> as welcome bonus</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Zap size={16} />
            </div>
            <span>Instant access — no email verification</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Shield size={16} />
            </div>
            <span>Secure Google account sign-in</span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By signing up, you agree to our{" "}
          <Link to="#" className="text-purple-600 hover:underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link to="#" className="text-purple-600 hover:underline">
            Privacy
          </Link>
        </p>

        {/* Already have account */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;