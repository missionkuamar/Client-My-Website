import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  updateProfile,
  logout,
} from "../../features/auth/authSlice";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Trash2,
  Bell,
  Sparkles,
  Star,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Save,
  
} from "lucide-react";
import { FaChrome } from "react-icons/fa";
/* ---------- Section Card ---------- */
const SectionCard = ({ icon: Icon, title, subtitle, children }) => (
  <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="border-b border-gray-100 p-4 sm:p-5">
      <h2 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-2">
        <Icon size={18} className="text-indigo-600" /> {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      )}
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </section>
);

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((s) => s.auth);

  /* ---------- Profile form ---------- */
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
  });

  useEffect(() => {
    if (user?.name) {
      setProfileForm({ name: user.name });
    }
  }, [user?.name]);

  /* ---------- Handlers ---------- */
  const handleNameChange = (e) => {
    setProfileForm({ name: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (profileForm.name.trim() === user?.name) {
      toast.error("No changes to save");
      return;
    }

    try {
      await dispatch(updateProfile({ name: profileForm.name.trim() })).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Update failed");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Sign out of your account?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is disabled. Contact support.");
  };

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          ⚙️ Settings
        </h1>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          Manage your profile and account preferences
        </p>
      </div>

      {/* ==================== PROFILE HERO ==================== */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-5 sm:p-6 mb-5 sm:mb-6">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/30 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl sm:text-4xl font-bold flex-shrink-0">
              {user?.name?.trim()?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-bold truncate flex items-center gap-2">
              {user?.name}
              <span className="text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded-full flex items-center gap-1">
                <FaChrome size={12} /> Google
              </span>
            </h2>
            <p className="text-sm opacity-90 truncate">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded-full capitalize">
                🎭 {user?.role}
              </span>
              <span className="text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                ⭐ {user?.stars ?? 0} stars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MAIN GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* ---------- Profile Section ---------- */}
        <SectionCard
          icon={User}
          title="Profile Information"
          subtitle="Update your display name"
        >
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleNameChange}
                required
                maxLength={60}
                placeholder="John Doe"
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                {profileForm.name.length}/60 characters
              </p>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Mail size={13} /> Email Address
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                  Verified via Google
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1 flex items-start gap-1">
                <Info size={12} className="mt-0.5 flex-shrink-0" />
                <span>
                  Email is linked to your Google account and cannot be changed
                  here.
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || profileForm.name.trim() === user?.name}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} /> Save Changes
                </>
              )}
            </button>
          </form>
        </SectionCard>

        {/* ---------- Security Section ---------- */}
        <SectionCard
          icon={ShieldCheck}
          title="Security"
          subtitle="Your account security status"
        >
          {/* Google Auth Info */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                <FaChrome size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-green-900">
                  Signed in with Google
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Your account is protected by Google's industry-leading
                  security.
                </p>
              </div>
            </div>
          </div>

          {/* Security features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-gray-500">
                  Managed by Google — highly secure
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  Email Verified
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  No Password Required
                </p>
                <p className="text-xs text-gray-500">
                  Google handles authentication securely
                </p>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              To update your password or email, visit your{" "}
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Google Account settings
              </a>
              .
            </p>
          </div>
        </SectionCard>

        {/* ---------- Preferences ---------- */}
        <SectionCard
          icon={Bell}
          title="Preferences"
          subtitle="Customize your experience"
        >
          <div className="space-y-3">
            {[
              {
                id: "emailNotif",
                label: "Email Notifications",
                desc: "Receive updates about your account",
                defaultChecked: true,
              },
              {
                id: "promo",
                label: "Promotional Emails",
                desc: "Get notified about special offers",
                defaultChecked: false,
              },
              {
                id: "newsletter",
                label: "Weekly Newsletter",
                desc: "Project highlights and tutorials",
                defaultChecked: true,
              },
            ].map((pref) => (
              <label
                key={pref.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  defaultChecked={pref.defaultChecked}
                  className="mt-0.5 w-4 h-4 accent-indigo-600 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {pref.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Info size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              Preferences are saved automatically. Changes apply immediately.
            </p>
          </div>
        </SectionCard>

        {/* ---------- Account Info ---------- */}
        <SectionCard
          icon={Info}
          title="Account Information"
          subtitle="Details about your account"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">User ID</span>
              <span className="text-xs font-mono text-gray-800 truncate ml-2 max-w-[180px]">
                {user?._id}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">Sign-in Method</span>
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <FaChrome size={12} /> Google
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">Role</span>
              <span className="text-xs font-semibold text-indigo-600 capitalize">
                {user?.role}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">Stars Balance</span>
              <span className="text-sm font-bold text-yellow-600 flex items-center gap-1">
                <Star size={12} /> {user?.stars ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-xs text-gray-600">Status</span>
              <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Active
              </span>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ==================== DANGER ZONE ==================== */}
      <div className="mt-5 sm:mt-6 bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="border-b border-red-100 bg-red-50/50 p-4 sm:p-5">
          <h2 className="text-sm sm:text-base font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle size={16} /> Danger Zone
          </h2>
          <p className="text-xs text-red-600 mt-0.5">
            Irreversible actions — proceed with caution
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {/* Sign Out */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Sign Out of Account
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                You'll need to sign in again with Google
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
            <div>
              <p className="text-sm font-medium text-red-800">
                Delete Account
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ==================== FOOTER TIP ==================== */}
      <div className="mt-5 sm:mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Sparkles size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Need help?
          </p>
          <p className="text-xs sm:text-sm text-blue-800 mt-0.5">
            Contact support at{" "}
            <span className="font-mono font-semibold">support@example.com</span>{" "}
            for any account-related issues.
          </p>
        </div>
      </div>
    </>
  );
};

export default Settings;