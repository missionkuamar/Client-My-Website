import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchMyPurchases,
  downloadProject,
} from "../../features/project/projectSlice";
import {
  Package,
  Star,
  Download,
  ShoppingBag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
} from "lucide-react";

/* ---------- Debounce ---------- */
function useDebounce(value, delay = 400) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

/* ---------- Stat Card ---------- */
const StatCard = ({ icon: Icon, label, value, sub, color = "indigo" }) => {
  const colors = {
    indigo: "from-indigo-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    yellow: "from-yellow-500 to-orange-500",
    green: "from-green-500 to-emerald-500",
    red: "from-rose-500 to-red-500",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white mb-3 shadow-lg`}
      >
        <Icon size={22} />
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};

/* ---------- Pagination ---------- */
const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, totalCount, limit } = pagination;
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible)
      start = Math.max(1, end - maxVisible + 1);
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-5 py-4 border-t border-gray-100 bg-gray-50/50">
      <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        Showing <strong className="text-gray-700">{startItem}</strong>–
        <strong className="text-gray-700">{endItem}</strong> of{" "}
        <strong className="text-gray-700">{totalCount}</strong>
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition"
        >
          <ChevronLeft size={16} />
        </button>
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span
              key={`e-${idx}`}
              className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none"
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                page === p
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const MyPurchases = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const {
    purchases = [],
    purchasesPagination = {
      page: 1,
      totalPages: 0,
      totalCount: 0,
      limit: 10,
    },
    purchasesStats = {
      total: 0,
      starsSpent: 0,
      active: 0,
      expired: 0,
      expiringSoon: 0,
    },
    loading,
    error,
  } = useSelector((s) => s.project);

  /* ---------- Filters (URL synced) ---------- */
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [priceFilter, setPriceFilter] = useState(
    searchParams.get("price") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [downloading, setDownloading] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    dispatch(
      fetchMyPurchases({
        search: debouncedSearch,
        priceFilter,
        statusFilter,
        sortBy,
        page,
        limit: 10,
      })
    );
  }, [dispatch, debouncedSearch, priceFilter, statusFilter, sortBy, page]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (priceFilter !== "all") params.price = priceFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    if (sortBy !== "newest") params.sort = sortBy;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    priceFilter,
    statusFilter,
    sortBy,
    page,
    setSearchParams,
  ]);

  /* ---------- Reset page on filter change ---------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, priceFilter, statusFilter, sortBy]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (p) => {
    if (p < 1 || p > purchasesPagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setPriceFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  const handleDownload = async (projectId, projectTitle) => {
    setDownloading(projectId);
    const toastId = toast.loading("Preparing download...");
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

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const hasActiveFilters =
    search ||
    priceFilter !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "newest" ||
    page > 1;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* ==================== HEADER ==================== */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          📦 My Purchases
        </h1>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          All the projects you've purchased and can download
        </p>
      </div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <StatCard
          icon={Package}
          label="Total"
          value={purchasesStats.total}
          sub={`${purchasesStats.active} active`}
          color="indigo"
        />
        <StatCard
          icon={CheckCircle2}
          label="Active"
          value={purchasesStats.active}
          sub="Currently valid"
          color="green"
        />
        <StatCard
          icon={AlertTriangle}
          label="Expired"
          value={purchasesStats.expired}
          sub="Renew needed"
          color="red"
        />
        <StatCard
          icon={Star}
          label="Stars Spent"
          value={purchasesStats.starsSpent?.toLocaleString("en-IN") || 0}
          sub="Lifetime"
          color="yellow"
        />
      </div>

      {/* ==================== FILTER BAR ==================== */}
      {purchasesStats.total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5 sm:mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by project title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">✅ Active</option>
                <option value="expired">⚠️ Expired</option>
              </select>

              {/* Price filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="low">Low (≤50⭐)</option>
                <option value="mid">Medium (51-200⭐)</option>
                <option value="high">High (200+⭐)</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Most Stars</option>
                <option value="price-low">Least Stars</option>
                <option value="expiry-soon">Expiring Soon</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  ✕ Clear
                </button>
              )}

              <Link
                to="/projects"
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition text-center"
              >
                🛍️ Browse
              </Link>
            </div>
          </div>

          {!loading && (
            <p className="text-xs text-gray-500 mt-3">
              Showing{" "}
              <strong className="text-gray-700">{purchases.length}</strong> of{" "}
              {purchasesPagination.totalCount} purchases
              {debouncedSearch && (
                <>
                  {" "}
                  for "<strong>{debouncedSearch}</strong>"
                </>
              )}
            </p>
          )}
        </div>
      )}

      {/* ==================== LIST ==================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Loading */}
        {loading && (
          <div className="p-10 sm:p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading purchases...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-10 sm:p-12 text-center">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-sm text-red-500 font-medium">Error: {error}</p>
            <button
              onClick={() =>
                dispatch(
                  fetchMyPurchases({
                    search: debouncedSearch,
                    priceFilter,
                    statusFilter,
                    sortBy,
                    page,
                    limit: 10,
                  })
                )
              }
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty — no purchases */}
        {!loading && !error && purchasesStats.total === 0 && (
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
        {!loading &&
          !error &&
          purchasesStats.total > 0 &&
          purchases.length === 0 && (
            <div className="p-10 sm:p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm text-gray-500 font-medium">
                {debouncedSearch
                  ? `No purchases match "${debouncedSearch}"`
                  : "No purchases match your filters"}
              </p>
              <button
                onClick={handleClear}
                className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* Purchase rows */}
        {!loading && !error && purchases.length > 0 && (
          <>
            <div className="divide-y divide-gray-100">
              {purchases.map((purchase) => {
                const p = purchase.project;
                if (!p) return null;

                // ⬇️ Expiry status
                const isExpired = purchase.isExpired;
                const isExpiringSoon = purchase.isExpiringSoon;
                const daysRemaining = purchase.daysRemaining ?? 0;

                return (
                  <div
                    key={purchase._id}
                    className="p-4 sm:p-5 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Thumbnail */}
                      {p.thumbnail ? (
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          loading="lazy"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                          📦
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {p.title}
                          </h3>

                          {/* ⬇️ STATUS BADGE */}
                          {isExpired ? (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <AlertTriangle size={10} /> Expired
                            </span>
                          ) : isExpiringSoon ? (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <Clock size={10} /> {daysRemaining}d left
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          )}

                          {p.category && (
                            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                              {p.category}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">
                          {p.description || "No description"}
                        </p>

                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Star size={11} className="text-yellow-500" />
                            Spent{" "}
                            <strong className="text-yellow-600">
                              {purchase.starsSpent}
                            </strong>
                          </span>

                          {/* ⬇️ EXPIRY DATE */}
                          {purchase.expiresAt && (
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              <strong
                                className={
                                  isExpired
                                    ? "text-red-600"
                                    : isExpiringSoon
                                    ? "text-amber-600"
                                    : "text-green-600"
                                }
                              >
                                {isExpired ? "Expired" : "Valid till"}{" "}
                                {formatDate(purchase.expiresAt)}
                              </strong>
                            </span>
                          )}

                          {purchase.renewalCount > 0 && (
                            <span className="flex items-center gap-1 text-indigo-600">
                              <RefreshCw size={10} /> Renewed{" "}
                              {purchase.renewalCount}x
                            </span>
                          )}

                          {p.fileSize && (
                            <span className="flex items-center gap-1">
                              <HardDrive size={11} />{" "}
                              {(p.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Link
                          to={`/projects/${p._id}`}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition text-center flex items-center justify-center gap-1.5"
                        >
                          <Eye size={14} /> View
                        </Link>

                        {/* ⬇️ DOWNLOAD / RENEW BUTTON */}
                        {isExpired ? (
                          <Link
                            to={`/projects/${p._id}`}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-amber-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-amber-700 transition flex items-center justify-center gap-1.5"
                          >
                            <RefreshCw size={14} /> Renew
                          </Link>
                        ) : (
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
                              <>
                                <Download size={14} /> Download
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              pagination={purchasesPagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* ==================== FOOTER TIP ==================== */}
      {!loading && purchasesStats.total > 0 && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-blue-800">
            💡 <strong>Tip:</strong> Purchases are valid for 1 year from the
            purchase/renewal date. Renew anytime before expiry. Filters persist
            in URL — bookmark your view!
          </p>
        </div>
      )}
    </>
  );
};

export default MyPurchases;