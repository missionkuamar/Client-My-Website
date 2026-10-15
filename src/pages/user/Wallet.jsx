import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchMyPayments } from "../../features/payment/paymentSlice";
import { useTheme } from "../../context/ThemeContext";
import {
  CreditCard,
  TrendingUp,
  Star,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  DollarSign,
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
  const { currentTheme } = useTheme();
  const colors = {
    indigo: "from-indigo-500 to-blue-500",
    purple: "from-purple-500 to-pink-500",
    yellow: "from-yellow-500 to-orange-500",
    green: "from-green-500 to-emerald-500",
    rose: "from-rose-500 to-red-500",
  };
  return (
    <div className={`rounded-2xl border shadow-sm p-4 sm:p-5 ${currentTheme.card}`}>
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white mb-3 shadow-lg`}
      >
        <Icon size={20} />
      </div>
      <p className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.muted}`}>
        {label}
      </p>
      <p className={`text-xl sm:text-2xl font-bold mt-1 ${currentTheme.text}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${currentTheme.muted}`}>{sub}</p>}
    </div>
  );
};

/* ---------- Pagination ---------- */
const Pagination = ({ pagination, onPageChange }) => {
  const { currentTheme } = useTheme();
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
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-5 py-4 border-t ${currentTheme.border}`}>
      <p className={`text-xs sm:text-sm order-2 sm:order-1 ${currentTheme.muted}`}>
        Showing <strong className={currentTheme.text}>{startItem}</strong>–
        <strong className={currentTheme.text}>{endItem}</strong> of{" "}
        <strong className={currentTheme.text}>{totalCount}</strong>
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed ${currentTheme.border} ${currentTheme.surface} ${currentTheme.hover}`}
        >
          <ChevronLeft size={16} />
        </button>
        {getPages().map((p, idx) =>
          p === "..." ? (
            <span
              key={`e-${idx}`}
              className={`w-9 h-9 flex items-center justify-center text-sm ${currentTheme.muted}`}
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
                  : `${currentTheme.surface} border ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover}`
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed ${currentTheme.border} ${currentTheme.surface} ${currentTheme.hover}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const Wallet = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);
  const { currentTheme } = useTheme();

  const { user } = useSelector((s) => s.auth);
  const {
    payments = [],
    paymentsPagination = { page: 1, totalPages: 0, totalCount: 0, limit: 10 },
    paymentsStats = { totalSpent: 0, totalStars: 0, transactions: 0 },
    loading,
    error,
  } = useSelector((s) => s.payment);

  /* ---------- Filters (URL synced) ---------- */
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [filterPlan, setFilterPlan] = useState(
    searchParams.get("plan") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 400);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    dispatch(
      fetchMyPayments({
        search: debouncedSearch,
        plan: filterPlan,
        sortBy,
        page,
        limit: 10,
      })
    );
  }, [dispatch, debouncedSearch, filterPlan, sortBy, page]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (filterPlan !== "all") params.plan = filterPlan;
    if (sortBy !== "newest") params.sort = sortBy;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, filterPlan, sortBy, page, setSearchParams]);

  /* ---------- Reset page on filter change ---------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, filterPlan, sortBy]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (p) => {
    if (p < 1 || p > paymentsPagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setFilterPlan("all");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters =
    search || filterPlan !== "all" || sortBy !== "newest" || page > 1;

  /* ---------- Format helpers ---------- */
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const formatDateTime = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const planLabels = {
    silver: { name: "Silver", color: "bg-slate-100 text-slate-700" },
    gold: { name: "Gold", color: "bg-yellow-100 text-yellow-700" },
    platinum: { name: "Platinum", color: "bg-purple-100 text-purple-700" },
    starter: { name: "Starter", color: "bg-blue-100 text-blue-700" },
    pro: { name: "Pro", color: "bg-indigo-100 text-indigo-700" },
    elite: { name: "Elite", color: "bg-pink-100 text-pink-700" },
  };

  const avgPurchase =
    paymentsStats.transactions > 0
      ? Math.round(paymentsStats.totalSpent / paymentsStats.transactions)
      : 0;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-5 sm:mb-6">
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${currentTheme.text}`}>
          💰 Wallet
        </h1>
        <p className={`mt-1 text-xs sm:text-sm ${currentTheme.muted}`}>
          Track your star purchases, payments, and transaction history
        </p>
      </div>

      {/* ==================== HERO BALANCE ==================== */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded-2xl shadow-lg p-5 sm:p-8 mb-5 sm:mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm opacity-90">Current Star Balance</p>
            <p className="text-4xl sm:text-5xl font-bold mt-2">
              ⭐ {user?.stars ?? 0}
            </p>
            <p className="text-sm opacity-90 mt-2">
              Ready to spend on premium projects
            </p>
          </div>
          <Link
            to="/stars"
            className="bg-white text-orange-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-yellow-50 transition shadow-lg w-full md:w-auto text-center"
          >
            💳 Buy More Stars
          </Link>
        </div>
      </div>

      {/* ==================== STATS GRID ==================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
        <StatCard
          icon={CreditCard}
          label="Transactions"
          value={paymentsStats.transactions}
          sub="Total purchases"
          color="indigo"
        />
        <StatCard
          icon={DollarSign}
          label="Total Spent"
          value={`₹${paymentsStats.totalSpent.toLocaleString("en-IN")}`}
          sub="Lifetime"
          color="green"
        />
        <StatCard
          icon={Star}
          label="Stars Bought"
          value={paymentsStats.totalStars.toLocaleString("en-IN")}
          sub="Total earned"
          color="yellow"
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Purchase"
          value={`₹${avgPurchase.toLocaleString("en-IN")}`}
          sub="Per transaction"
          color="purple"
        />
      </div>

      {/* ==================== ACTION BAR ==================== */}
      {paymentsStats.transactions > 0 && (
        <div className={`rounded-2xl border shadow-sm p-4 mb-5 sm:mb-6 ${currentTheme.card}`}>
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                size={16}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${currentTheme.muted}`}
              />
              <input
                type="text"
                placeholder="Search by plan, order ID, or payment ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-9 pr-9 py-2.5 border rounded-lg text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${currentTheme.surface} ${currentTheme.border} ${currentTheme.text}`}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${currentTheme.muted} hover:opacity-80`}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className={`flex-1 sm:flex-none px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${currentTheme.surface} ${currentTheme.border} ${currentTheme.text}`}
              >
                <option value="all">All Plans</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`flex-1 sm:flex-none px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${currentTheme.surface} ${currentTheme.border} ${currentTheme.text}`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Highest Amount</option>
                <option value="amount-low">Lowest Amount</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition ${currentTheme.muted} ${currentTheme.hover}`}
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {!loading && (
            <p className={`text-xs mt-3 ${currentTheme.muted}`}>
              Showing{" "}
              <strong className={currentTheme.text}>{payments.length}</strong> of{" "}
              {paymentsPagination.totalCount} transactions
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

      {/* ==================== TRANSACTIONS LIST ==================== */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${currentTheme.card}`}>
        {/* Loading */}
        {loading && (
          <div className="p-10 sm:p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className={`text-sm ${currentTheme.muted}`}>Loading transactions...</p>
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
                  fetchMyPayments({
                    search: debouncedSearch,
                    plan: filterPlan,
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

        {/* Empty — no transactions */}
        {!loading && !error && paymentsStats.transactions === 0 && (
          <div className="p-10 sm:p-16 text-center">
            <p className="text-6xl mb-4">💳</p>
            <h3 className={`text-lg font-bold mb-2 ${currentTheme.text}`}>
              No transactions yet
            </h3>
            <p className={`text-sm mb-6 max-w-md mx-auto ${currentTheme.muted}`}>
              You haven't purchased any stars. Top up your wallet to unlock
              premium projects!
            </p>
            <Link
              to="/stars"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow"
            >
              ⭐ Buy Stars Now
            </Link>
          </div>
        )}

        {/* Empty — filter no match */}
        {!loading &&
          !error &&
          paymentsStats.transactions > 0 &&
          payments.length === 0 && (
            <div className="p-10 sm:p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className={`text-sm font-medium ${currentTheme.muted}`}>
                No transactions match your filters
              </p>
              <button
                onClick={handleClear}
                className="mt-4 px-4 py-2 text-sm text-indigo-500 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* Rows */}
        {!loading && !error && payments.length > 0 && (
          <>
            <div className={`divide-y ${currentTheme.border}`}>
              {payments.map((txn) => {
                const planInfo = planLabels[txn.plan] || {
                  name: txn.plan,
                  color: "bg-gray-100 text-gray-700",
                };
                const isSuccess = txn.status === "paid";

                return (
                  <div
                    key={txn._id}
                    className={`p-4 sm:p-5 transition ${currentTheme.hover}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 ${
                          isSuccess
                            ? "bg-gradient-to-br from-green-500 to-emerald-500"
                            : "bg-gradient-to-br from-rose-500 to-red-500"
                        }`}
                      >
                        {isSuccess ? "✅" : "❌"}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-sm sm:text-base capitalize ${currentTheme.text}`}>
                            {planInfo.name} Plan
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${planInfo.color}`}
                          >
                            ⭐ {txn.stars} stars
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              isSuccess
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {isSuccess ? "Paid" : "Failed"}
                          </span>
                        </div>

                        <div className={`flex flex-wrap gap-3 sm:gap-4 text-xs mt-1.5 ${currentTheme.muted}`}>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} /> {formatDate(txn.createdAt)}
                          </span>
                          {txn.orderId && (
                            <span className="truncate">
                              🆔 {txn.orderId.substring(0, 20)}...
                            </span>
                          )}
                          {txn.paymentId && (
                            <span className="truncate">
                              💳 {txn.paymentId.substring(0, 20)}...
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg sm:text-xl font-bold ${currentTheme.text}`}>
                          ₹{(txn.amount / 100).toLocaleString("en-IN")}
                        </p>
                        <p className={`text-xs mt-0.5 ${currentTheme.muted}`}>
                          {formatDateTime(txn.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              pagination={paymentsPagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* ==================== FOOTER TIP ==================== */}
      {!loading && paymentsStats.transactions > 0 && (
        <div className={`mt-5 border rounded-2xl p-4 sm:p-5 ${currentTheme.card}`}>
          <p className={`text-xs sm:text-sm ${currentTheme.muted}`}>
            💡 <strong className={currentTheme.text}>Tip:</strong> Filters persist in URL — bookmark or share
            your filtered view. Need help? Note the <strong className={currentTheme.text}>Order ID</strong>{" "}
            and contact support. Payments secured by Razorpay.
          </p>
        </div>
      )}
    </>
  );
};

export default Wallet;