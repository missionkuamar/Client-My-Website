import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchProjectById,
  buyProject,
  downloadProject,
  clearCurrentProject,
} from "../../features/project/projectSlice";
import toast from "react-hot-toast";
import {
  Download,
  Star,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, isPurchased, loading, buying, error } = useSelector(
    (s) => s.project
  );
  const { user } = useSelector((s) => s.auth);

  /* ---------- Local expiry state ---------- */
  const [isExpired, setIsExpired] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [downloading, setDownloading] = useState(false);

  /* ---------- Fetch project ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await dispatch(fetchProjectById(id)).unwrap();
        setIsExpired(res.isExpired || false);
        setExpiresAt(res.expiresAt || null);
        setDaysRemaining(res.daysRemaining || 0);
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    load();
    return () => dispatch(clearCurrentProject());
  }, [dispatch, id]);

  /* ---------- Buy / Renew ---------- */
  const handleBuy = async () => {
    const isRenewal = isPurchased && isExpired;
    if (
      !window.confirm(
        `${
          isRenewal ? "Renew" : "Buy"
        } for ⭐ ${currentProject.price} stars?\n\nAccess will be valid for 1 year.`
      )
    )
      return;

    try {
      const res = await dispatch(buyProject(id)).unwrap();

      toast.success(
        isRenewal
          ? `✅ Renewed! Valid until ${new Date(res.expiresAt).toLocaleDateString()}`
          : `✅ Purchased! Valid for 365 days.`,
        { duration: 4000 }
      );

      // Refresh project
      const fresh = await dispatch(fetchProjectById(id)).unwrap();
      setIsExpired(fresh.isExpired || false);
      setExpiresAt(fresh.expiresAt || null);
      setDaysRemaining(fresh.daysRemaining || 0);
    } catch (err) {
      toast.error(err || "Purchase failed");
    }
  };

  /* ---------- Download ---------- */
  const handleDownload = async () => {
    setDownloading(true);
    const toastId = toast.loading("Preparing download...");
    try {
      const res = await dispatch(downloadProject(id)).unwrap();
      window.open(res, "_blank");
      toast.success("Download started!", { id: toastId });
    } catch (err) {
      toast.error(err || "Download failed", { id: toastId });
    } finally {
      setDownloading(false);
    }
  };

  /* ---------- Loading ---------- */
  if (loading || !currentProject) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  const hasEnoughStars = (user?.stars ?? 0) >= currentProject.price;
  const isExpiringSoon = !isExpired && daysRemaining <= 30 && isPurchased;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* Back link */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-4 transition"
      >
        <ChevronLeft size={14} /> Back to Projects
      </Link>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Thumbnail */}
        {currentProject.thumbnail && (
          <img
            src={currentProject.thumbnail}
            alt={currentProject.title}
            className="w-full h-56 sm:h-72 object-cover"
          />
        )}

        <div className="p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {currentProject.title}
          </h1>

          {/* Category */}
          {currentProject.category && (
            <span className="inline-block text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium capitalize mb-4">
              {currentProject.category}
            </span>
          )}

          {/* Description */}
          <p className="text-gray-600 whitespace-pre-line leading-relaxed mb-6">
            {currentProject.description}
          </p>

          {/* Price + Balance */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <span className="text-2xl font-bold text-yellow-600 flex items-center gap-1">
              <Star size={22} className="fill-yellow-500 text-yellow-500" />
              {currentProject.price}
            </span>
            <span className="text-sm text-gray-500">
              Your stars: <strong className="text-yellow-600">⭐ {user?.stars ?? 0}</strong>
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* ⬇️ PURCHASE STATUS BOX */}
          {isPurchased && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 mb-5 ${
                isExpired
                  ? "bg-red-50 border-red-200"
                  : isExpiringSoon
                  ? "bg-amber-50 border-amber-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="text-2xl flex-shrink-0">
                {isExpired ? (
                  <AlertTriangle size={24} className="text-red-600" />
                ) : isExpiringSoon ? (
                  <Clock size={24} className="text-amber-600" />
                ) : (
                  <CheckCircle2 size={24} className="text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-bold ${
                    isExpired
                      ? "text-red-800"
                      : isExpiringSoon
                      ? "text-amber-800"
                      : "text-green-800"
                  }`}
                >
                  {isExpired
                    ? "Access Expired"
                    : isExpiringSoon
                    ? "Expiring Soon"
                    : "Active Access"}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    isExpired
                      ? "text-red-700"
                      : isExpiringSoon
                      ? "text-amber-700"
                      : "text-green-700"
                  }`}
                >
                  {isExpired
                    ? `Expired on ${new Date(expiresAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}. Renew to continue downloading.`
                    : `Valid until ${new Date(expiresAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )} · ${daysRemaining} day${
                        daysRemaining !== 1 ? "s" : ""
                      } remaining`}
                </p>
              </div>
            </div>
          )}

          {/* ⬇️ ACTION BUTTONS */}
          {isPurchased && !isExpired ? (
            // ============ ACTIVE → DOWNLOAD ============
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Preparing...
                </>
              ) : (
                <>
                  <Download size={18} /> Download ZIP
                </>
              )}
            </button>
          ) : isPurchased && isExpired ? (
            // ============ EXPIRED → RENEW ============
            <button
              onClick={handleBuy}
              disabled={buying || !hasEnoughStars}
              className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {buying ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Renewing...
                </>
              ) : !hasEnoughStars ? (
                `Not enough stars (need ${currentProject.price})`
              ) : (
                <>
                  <RefreshCw size={18} /> Renew Access for ⭐{" "}
                  {currentProject.price}
                </>
              )}
            </button>
          ) : (
            // ============ NOT PURCHASED → BUY ============
            <button
              onClick={handleBuy}
              disabled={buying || !hasEnoughStars}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {buying ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Purchasing...
                </>
              ) : !hasEnoughStars ? (
                `Not enough stars (need ${currentProject.price})`
              ) : (
                <>Buy for ⭐ {currentProject.price}</>
              )}
            </button>
          )}

          {/* Info: 1 year validity */}
          {!isPurchased && (
            <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
              <CheckCircle2 size={12} className="text-green-600" />
              Access valid for 1 year from purchase
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;