import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  blockUser,
  unblockUser,
  banUser,
  suspendUser,
  adjustUserStars,
  clearSelectedUser,
} from "../../features/user/userSlice";
import {
  X,
  Shield,
  Ban,
  Lock,
  Unlock,
  Star,
  Mail,
  Calendar,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

/* ---------- Action Modal ---------- */
const ActionModal = ({ title, description, actionLabel, color = "red", onConfirm, onClose, requiresReason = false, requiresDays = false }) => {
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onConfirm({ reason, days });
      onClose();
    } catch (err) {
      toast.error(err || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    red: "bg-red-600 hover:bg-red-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    green: "bg-green-600 hover:bg-green-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-5">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>

          {requiresReason && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Enter reason..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          )}

          {requiresDays && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Suspend for
              </label>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 p-3 flex gap-2 justify-end bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 py-2 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center gap-2 ${colors[color]}`}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              actionLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Stars Adjust Modal ---------- */
const StarsModal = ({ user, onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("add");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-5">
          <h3 className="text-base font-bold text-gray-800">
            ⭐ Adjust Stars
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {user.name} currently has ⭐ {user.stars || 0} stars
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Action
              </label>
              <div className="flex gap-2">
                {["add", "remove"].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAction(a)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border-2 transition ${
                      action === a
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {a === "add" ? "➕ Add" : "➖ Remove"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-3 flex gap-2 justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit({ amount: Number(amount), action })}
            disabled={!amount || amount <= 0}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {action === "add" ? "Add" : "Remove"} Stars
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main Modal ---------- */
const UserDetailModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const { selectedUserData, detailsLoading } = useSelector((s) => s.user);
  const [actionModal, setActionModal] = useState(null);
  const [starsModal, setStarsModal] = useState(false);

  useEffect(() => {
    if (user?._id) dispatch(fetchUserDetails(user._id));
    return () => dispatch(clearSelectedUser());
  }, [dispatch, user?._id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !actionModal && !starsModal) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose, actionModal, starsModal]);

  if (!user) return null;

  const details = selectedUserData?.user || user;
  const stats = selectedUserData?.stats || {};
  const purchases = selectedUserData?.purchases || [];

  /* ---------- Status badge ---------- */
  const statusBadge = {
    active: "bg-green-100 text-green-700",
    blocked: "bg-amber-100 text-amber-700",
    banned: "bg-red-100 text-red-700",
    suspended: "bg-orange-100 text-orange-700",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-5 border-b border-gray-100">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {details.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  {details.name}
                </h2>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                  <Mail size={11} /> {details.email}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${statusBadge[details.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {details.status || "active"}
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                    {details.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {detailsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-gray-500">Loading details...</p>
              </div>
            ) : (
              <>
                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-yellow-700 uppercase font-semibold">Stars</p>
                    <p className="text-lg font-bold text-yellow-700 mt-1">
                      ⭐ {details.stars || 0}
                    </p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-indigo-700 uppercase font-semibold">Purchases</p>
                    <p className="text-lg font-bold text-indigo-700 mt-1">
                      <ShoppingBag size={14} className="inline" /> {stats.totalPurchases || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-green-700 uppercase font-semibold">Spent</p>
                    <p className="text-lg font-bold text-green-700 mt-1">
                      ₹{stats.totalSpent || 0}
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-purple-700 uppercase font-semibold">Logins</p>
                    <p className="text-lg font-bold text-purple-700 mt-1">
                      {details.loginCount || 0}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Calendar size={14} /> Joined
                    </span>
                    <span className="font-medium text-gray-800">
                      {new Date(details.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {details.lastLogin && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <TrendingUp size={14} /> Last Active
                      </span>
                      <span className="font-medium text-gray-800">
                        {new Date(details.lastLogin).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {details.blockReason && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                      <p className="text-amber-800 flex items-start gap-1.5">
                        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Block reason:</strong> {details.blockReason}
                        </span>
                      </p>
                    </div>
                  )}
                  {details.banReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                      <p className="text-red-800 flex items-start gap-1.5">
                        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Ban reason:</strong> {details.banReason}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Recent purchases */}
                {purchases.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      🛒 Recent Purchases ({purchases.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {purchases.slice(0, 5).map((p) => (
                        <div
                          key={p._id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                          {p.project?.thumbnail ? (
                            <img
                              src={p.project.thumbnail}
                              alt={p.project?.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                              📦
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {p.project?.title || "Deleted Project"}
                            </p>
                            <p className="text-xs text-gray-500">
                              ⭐ {p.starsSpent} ·{" "}
                              {new Date(p.createdAt).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions footer */}
          <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50 flex flex-wrap gap-2 justify-end">
            <button
              onClick={() => setStarsModal(true)}
              className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-yellow-600 flex items-center gap-1.5"
            >
              <Star size={14} /> Adjust Stars
            </button>

            {details.status === "active" && (
              <>
                <button
                  onClick={() => setActionModal("block")}
                  className="px-3 py-2 bg-amber-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-amber-700 flex items-center gap-1.5"
                >
                  <Lock size={14} /> Block
                </button>
                <button
                  onClick={() => setActionModal("suspend")}
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-orange-700 flex items-center gap-1.5"
                >
                  <AlertTriangle size={14} /> Suspend
                </button>
                <button
                  onClick={() => setActionModal("ban")}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700 flex items-center gap-1.5"
                >
                  <Ban size={14} /> Ban
                </button>
              </>
            )}

            {(details.status === "blocked" ||
              details.status === "suspended" ||
              details.status === "banned") && (
              <button
                onClick={() => setActionModal("unblock")}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-700 flex items-center gap-1.5"
              >
                <Unlock size={14} /> Unblock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Action Modals ---------- */}
      {actionModal === "block" && (
        <ActionModal
          title="Block User?"
          description={`Block ${details.name}? They won't be able to login.`}
          actionLabel="Block User"
          color="amber"
          requiresReason
          onConfirm={async ({ reason }) =>
            dispatch(blockUser({ userId: user._id, reason })).unwrap()
          }
          onClose={() => setActionModal(null)}
        />
      )}
      {actionModal === "ban" && (
        <ActionModal
          title="Ban User?"
          description={`Permanently ban ${details.name}? This cannot be undone easily.`}
          actionLabel="Ban User"
          color="red"
          requiresReason
          onConfirm={async ({ reason }) =>
            dispatch(banUser({ userId: user._id, reason })).unwrap()
          }
          onClose={() => setActionModal(null)}
        />
      )}
      {actionModal === "suspend" && (
        <ActionModal
          title="Suspend User?"
          description={`Temporarily suspend ${details.name}.`}
          actionLabel="Suspend User"
          color="amber"
          requiresReason
          requiresDays
          onConfirm={async ({ reason, days }) =>
            dispatch(suspendUser({ userId: user._id, reason, days })).unwrap()
          }
          onClose={() => setActionModal(null)}
        />
      )}
      {actionModal === "unblock" && (
        <ActionModal
          title="Restore Access?"
          description={`Unblock ${details.name} and restore their access.`}
          actionLabel="Unblock"
          color="green"
          onConfirm={async () =>
            dispatch(unblockUser(user._id)).unwrap()
          }
          onClose={() => setActionModal(null)}
        />
      )}

      {starsModal && (
        <StarsModal
          user={details}
          onClose={() => setStarsModal(false)}
          onSubmit={async ({ amount, action }) => {
            await dispatch(
              adjustUserStars({ userId: user._id, amount, action })
            ).unwrap();
            toast.success("Stars updated");
            setStarsModal(false);
            dispatch(fetchUserDetails(user._id));
          }}
        />
      )}
    </>
  );
};

export default UserDetailModal;