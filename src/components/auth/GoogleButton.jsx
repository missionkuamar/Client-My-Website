import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { googleLogin } from "../../features/auth/authSlice";

const GoogleButton = ({ text = "continue_with", width = 380 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const { loading } = useSelector((s) => s.auth);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double init (React StrictMode)
    if (initializedRef.current) return;

    if (!window.google) {
      console.error("❌ [GoogleButton] Google script not loaded yet");
      toast.error("Google Sign-In not loaded. Refresh the page.");
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("❌ [GoogleButton] VITE_GOOGLE_CLIENT_ID missing in .env");
      toast.error("Google Client ID missing");
      return;
    }

    // console.log("✅ [GoogleButton] Initializing with Client ID:", clientId);
    // console.log("✅ [GoogleButton] Origin:", window.location.origin);

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width,
        text,
        shape: "rectangular",
        logo_alignment: "left",
      });

      initializedRef.current = true;
      // console.log("✅ [GoogleButton] Render complete");
    } catch (err) {
      console.error("❌ [GoogleButton] Initialization error:", err);
      toast.error("Google Sign-In failed to load");
    }
    // eslint-disable-next-line
  }, []);

  const handleCredentialResponse = async (response) => {
    // console.log("✅ [GoogleButton] Credential received");
    // console.log("   → JWT length:", response.credential?.length);

    const toastId = toast.loading("Signing you in...");

    try {
      const result = await dispatch(googleLogin(response.credential)).unwrap();

      // console.log("✅ [GoogleButton] Login success:", result.user);

      toast.success(
        result.isNewUser
          ? `Welcome, ${result.user.name}! 🎉`
          : `Welcome back, ${result.user.name}!`,
        { id: toastId }
      );

      if (result.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("❌ [GoogleButton] Login failed:", err);
      toast.error(err || "Google login failed", { id: toastId });
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div ref={buttonRef} className="w-full flex justify-center" />

      {loading && (
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></span>
          Signing you in...
        </p>
      )}
    </div>
  );
};

export default GoogleButton;