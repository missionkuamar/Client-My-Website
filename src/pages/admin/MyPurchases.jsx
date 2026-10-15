import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchMyPurchases,
  downloadProject,
} from "../../features/project/projectSlice";

/* ---------- Reusable Stat Card ---------- */
const StatCard = ({ icon, label, value, sub, color = "indigo" }) => {
  const colors = {
    indigo: "from-indigo-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    yellow: "from-yellow-500 to-orange-500",
    green: "from-green-500 to-emerald-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-2xl text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};

const MyPurchases = () => {
  const dispatch = useDispatch();
  const { purchases = [], loading } = useSelector((s) => s.project);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    dispatch(fetchMyPurchases());
  }, [dispatch]);

  /* ---------- Derived Counts ---------- */
  const counts = useMemo(() => {
    const totalSpent = purchases.reduce(
      (sum, p) => sum + (Number(p.starsSpent) || 0),
      0
    );
    return {
      total: purchases.length,
      spent: totalSpent,
    };
  }, [purchases]);

  /* ---------- Filter + Sort ---------- */
  const filtered = useMemo(() => {
    return purchases
      .filter((purchase) => {
        const p = purchase.project;
        if (!p) return false;

        const q = search.trim().toLowerCase();
        return !q || p.title?.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "price-high")
          return (b.starsSpent || 0) - (a.starsSpent || 0);
        if (sortBy === "price-low")
          return (a.starsSpent || 0) - (b.starsSpent || 0);
        return 0;
      });
  }, [purchases, search, sortBy]);

  /* ---------- Download Handler ---------- */
  const handleDownload = async (projectId, projectTitle) => {
    setDownloading(projectId);
    const toastId = toast.loading(`Preparing download...`);

    try {
      const res = await dispatch(downloadProject(projectId)).unwrap();
      window.open(res, "_blank");
      toast.success(`Download started: ${projectTitle}`, { id: toastId });
    } catch (err) {
      toast.error(err || "Download failed", { id: toastId });
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          📦 My Purchases
        </h1>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          All the projects you've purchased and can download
        </p>
      </div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <StatCard
          icon="📦"
          label="Purchased"
          value={counts.total}
          sub="Total projects"
          color="indigo"
        />
        <StatCard
          icon="⭐"
          label="Stars Spent"
          value={counts.spent}
          sub="Lifetime spent"
          color="yellow"
        />
        <StatCard
          icon="⬇️"
          label="Downloads"
          value={counts.total}
          sub="Available anytime"
          color="green"
        />
        <StatCard
          icon="🛍️"
          label="Explore"
          value="+"
          sub="Buy more projects"
          color="purple"
        />
      </div>

      {/* ==================== FILTER BAR ==================== */}
      {purchases.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search purchases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Most Stars</option>
              <option value="price-low">Least Stars</option>
            </select>

            {/* Browse button */}
            <Link
              to="/projects"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition text-center"
            >
              🛍️ Browse
            </Link>
          </div>

          {!loading && (
            <p className="text-xs text-gray-500 mt-3">
              Showing{" "}
              <strong className="text-gray-700">{filtered.length}</strong> of{" "}
              {purchases.length} purchases
            </p>
          )}
        </div>
      )}

      {/* ==================== PURCHASES LIST ==================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Loading */}
        {loading && (
          <div className="p-10 sm:p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading purchases...</p>
          </div>
        )}

        {/* Empty — no purchases at all */}
        {!loading && purchases.length === 0 && (
          <div className="p-10 sm:p-16 text-center">
            <p className="text-6xl mb-4">🛒</p>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No purchases yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              You haven't bought any projects. Explore our marketplace and find
              something great to build with!
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow"
            >
              🛍️ Browse Projects
            </Link>
          </div>
        )}

        {/* Empty — filter no match */}
        {!loading && purchases.length > 0 && filtered.length === 0 && (
          <div className="p-10 sm:p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-gray-500 font-medium">
              No purchases match "{search}"
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSortBy("newest");
              }}
              className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Purchase cards */}
        {!loading && filtered.length > 0 && (
          <div className="divide-y divide-gray-100">
            {filtered.map((purchase) => {
              const p = purchase.project;
              if (!p) return null;

              return (
                <div
                  key={purchase._id}
                  className="p-4 sm:p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl flex-shrink-0">
                      📦
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                          {p.title}
                        </h3>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          ✅ Owned
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">
                        {p.description || "No description"}
                      </p>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          ⭐ Purchased for{" "}
                          <strong className="text-yellow-600">
                            {purchase.starsSpent}
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          📅 {formatDate(purchase.createdAt)}
                        </span>
                        {p.fileSize && (
                          <span className="flex items-center gap-1">
                            💾{" "}
                            {(p.fileSize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        to={`/projects/${p._id}`}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition text-center"
                      >
                        👁️ View
                      </Link>
                      <button
                        onClick={() => handleDownload(p._id, p.title)}
                        disabled={downloading === p._id}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        {downloading === p._id ? (
                          <>
                            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Preparing
                          </>
                        ) : (
                          <>⬇️ Download</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================== FOOTER TIP ==================== */}
      {!loading && purchases.length > 0 && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-blue-800">
            💡 <strong>Tip:</strong> All your purchases are stored permanently.
            You can download them anytime, anywhere.
          </p>
        </div>
      )}
    </>
  );
};

export default MyPurchases;