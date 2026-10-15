import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "../../features/notification/notificationSlice";
import {
  Bell,
  BellOff,
  ShoppingBag,
  CreditCard,
  Settings as SettingsIcon,
  Gift,
  AlertTriangle,
  CheckCircle2,
  Search,
  X,
  Check,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Home,
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

/* ---------- Type config ---------- */
const TYPE_CONFIG = {
  purchase: { icon: ShoppingBag, color: "bg-indigo-100 text-indigo-700" },
  payment: { icon: CreditCard, color: "bg-green-100 text-green-700" },
  system: { icon: SettingsIcon, color: "bg-gray-100 text-gray-700" },
  promo: { icon: Gift, color: "bg-pink-100 text-pink-700" },
  alert: { icon: AlertTriangle, color: "bg-red-100 text-red-700" },
  success: { icon: CheckCircle2, color: "bg-green-100 text-green-700" },
};

/* ---------- Time helper ---------- */
const timeAgo = (dateStr) => {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
const Notifications = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const {
    notifications = [],
    unreadCount = 0,
    pagination = { page: 1, totalPages: 0, totalCount: 0, limit: 10 },
    stats = { total: 0, unread: 0, read: 0 },
    loading,
    error,
  } = useSelector((s) => s.notification);

  /* ---------- Filters (URL synced) ---------- */
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const [typeFilter, setTypeFilter] = useState(
    searchParams.get("type") || "all"
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 400);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    dispatch(
      fetchNotifications({
        search: debouncedSearch,
        filter,
        type: typeFilter,
        page,
        limit: 10,
      })
    );
  }, [dispatch, debouncedSearch, filter, typeFilter, page]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (filter !== "all") params.filter = filter;
    if (typeFilter !== "all") params.type = typeFilter;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filter, typeFilter, page, setSearchParams]);

  /* ---------- Reset page on filter change ---------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, filter, typeFilter]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setFilter("all");
    setTypeFilter("all");
    setPage(1);
  };

  const handleMarkRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
    } catch (err) {
      toast.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await dispatch(markAllNotificationsRead()).unwrap();
      toast.success("All marked as read");
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Notification deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  const handleClearAll = () => {
    if (!window.confirm("Clear all notifications? This cannot be undone."))
      return;
    dispatch(clearAllNotifications())
      .unwrap()
      .then(() => toast.success("All notifications cleared"))
      .catch((err) => toast.error(err));
  };

  const hasActiveFilters =
    search || filter !== "all" || typeFilter !== "all" || page > 1;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* ==================== HEADER ==================== */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Bell size={24} /> Notifications
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            Stay updated with your account activity
          </p>
        </div>

        {stats.total > 0 && (
          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5"
              >
                <Check size={14} /> Mark all read
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* ==================== STATS ==================== */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Total
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Unread
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-red-500 mt-1">
            {stats.unread}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
            Read
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
            {stats.read}
          </p>
        </div>
      </div>

      {/* ==================== FILTER BAR ==================== */}
      {stats.total > 0 && (
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
                placeholder="Search notifications..."
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
              {/* Type dropdown */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="purchase">🛍️ Purchase</option>
                <option value="payment">💳 Payment</option>
                <option value="system">⚙️ System</option>
                <option value="promo">🎁 Promo</option>
                <option value="alert">⚠️ Alert</option>
                <option value="success">✅ Success</option>
              </select>

              {/* Filter tabs */}
              <div className="flex bg-gray-50 rounded-lg p-1">
                {[
                  { id: "all", label: "All" },
                  { id: "unread", label: "Unread" },
                  { id: "read", label: "Read" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition ${
                      filter === tab.id
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {tab.id === "unread" && unreadCount > 0 && (
                      <span className="ml-1 text-xs text-red-500">
                        ({unreadCount})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {!loading && (
            <p className="text-xs text-gray-500 mt-3">
              Showing <strong className="text-gray-700">{notifications.length}</strong>{" "}
              of {pagination.totalCount} notifications
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
            <p className="text-sm text-gray-500">Loading notifications...</p>
          </div>
        )}

        {/* Empty — no notifications */}
        {!loading && stats.total === 0 && (
          <div className="p-10 sm:p-16 text-center">
            <BellOff size={56} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              You're all caught up! We'll notify you when something happens
              with your account.
            </p>
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              <Home size={16} /> Back to Dashboard
            </Link>
          </div>
        )}

        {/* Empty — filter no match */}
        {!loading && stats.total > 0 && notifications.length === 0 && (
          <div className="p-10 sm:p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-gray-500 font-medium">
              No notifications match your filters
            </p>
            <button
              onClick={handleClear}
              className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Notification rows */}
        {!loading && notifications.length > 0 && (
          <>
            <div className="divide-y divide-gray-100">
              {notifications.map((n) => {
                const typeInfo = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                const Icon = typeInfo.icon;

                return (
                  <div
                    key={n._id}
                    className={`p-4 sm:p-5 transition group ${
                      !n.isRead
                        ? "bg-indigo-50/40 hover:bg-indigo-50/60"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Icon */}
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}
                      >
                        <Icon size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3
                            className={`text-sm sm:text-base truncate ${
                              !n.isRead
                                ? "font-bold text-gray-900"
                                : "font-medium text-gray-700"
                            }`}
                          >
                            {n.title}
                          </h3>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                          )}
                          <span
                            className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}
                          >
                            {n.type}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {n.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>🕒 {timeAgo(n.createdAt)}</span>
                          {n.link && (
                            <Link
                              to={n.link}
                              className="text-indigo-600 hover:underline font-medium flex items-center gap-1"
                            >
                              View details <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition">
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkRead(n._id)}
                            className="w-8 h-8 rounded-lg hover:bg-green-100 text-green-600 flex items-center justify-center transition"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="w-8 h-8 rounded-lg hover:bg-red-100 text-red-500 flex items-center justify-center transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      {/* ==================== TIP ==================== */}
      {!loading && stats.total > 0 && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-blue-800">
            💡 <strong>Tip:</strong> Hover over a notification to quickly mark
            it as read or delete. Filters persist in URL — bookmark your view!
          </p>
        </div>
      )}
    </>
  );
};

export default Notifications;