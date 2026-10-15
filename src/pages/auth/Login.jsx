import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import GoogleButton from "../../components/auth/GoogleButton";
import { Shield, Zap, Star, Check } from "lucide-react";

const Login = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl mb-3 shadow-lg">
            🛍️
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to continue to your account
          </p>
        </div>

        {/* Google Sign In */}
        <GoogleButton text="continue_with" />

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 font-medium">
            ONE-CLICK SIGN IN
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Why Google Sign In?
          </p>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>No password to remember</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>Secure & verified account</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
            <span>Instant access to your dashboard</span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to our{" "}
          <Link to="#" className="text-indigo-600 hover:underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link to="#" className="text-indigo-600 hover:underline">
            Privacy Policy
          </Link>
        </p>

        {/* New user hint */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            New to our platform?{" "}
            <span className="text-indigo-600 font-semibold">
              Just sign in with Google
            </span>{" "}
            — your account will be created automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;