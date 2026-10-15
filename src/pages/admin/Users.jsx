import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchAllUsers,
  bulkUserAction,
  clearSuccess,
} from "../../features/user/userSlice";
import UserTable from "../../components/admin/UserTable";
import UserDetailModal from "../../components/admin/UserDetailModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";

/* ---------- Debounce ---------- */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ---------- Stat Pill ---------- */
const StatPill = ({ icon, label, value, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    gray: "bg-gray-100 text-gray-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${colors[color]}`}
    >
      <span>{icon}</span>
      <span>{label}:</span>
      <span>{value}</span>
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

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
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

  const ChevronIcon = ({ dir }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );

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
          <ChevronIcon dir="left" />
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
          <ChevronIcon dir="right" />
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const Users = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    users = [],
    pagination = { page: 1, totalPages: 0, totalCount: 0, limit: 10 },
    stats = {},
    loading,
    error,
  } = useSelector((s) => s.user);

  /* ---------- Filters (URL synced) ---------- */
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "all"
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 400);
  const isFirstRender = useRef(true);

  /* ---------- Selection ---------- */
  const [selectedIds, setSelectedIds] = useState([]);

  /* ---------- Modals ---------- */
  const [viewUser, setViewUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    dispatch(
      fetchAllUsers({
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
        sortBy,
        page,
        limit: 10,
      })
    );
    // eslint-disable-next-line
  }, [dispatch, debouncedSearch, roleFilter, statusFilter, sortBy, page]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (roleFilter !== "all") params.role = roleFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    if (sortBy !== "newest") params.sort = sortBy;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, roleFilter, statusFilter, sortBy, page, setSearchParams]);

  /* ---------- Reset page on filter change ---------- */
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
    setSelectedIds([]);
  }, [debouncedSearch, roleFilter, statusFilter, sortBy]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
    setSortBy("newest");
    setPage(1);
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u._id));
    }
  };

  /* ---------- Bulk actions ---------- */
  const handleBulkAction = async (action) => {
    if (!selectedIds.length) return;
    try {
      await dispatch(
        bulkUserAction({ userIds: selectedIds, action, reason: "" })
      ).unwrap();
      toast.success(`Bulk ${action} complete`);
      setSelectedIds([]);
      setBulkAction(null);
      dispatch(
        fetchAllUsers({
          search: debouncedSearch,
          role: roleFilter,
          status: statusFilter,
          sortBy,
          page,
          limit: 10,
        })
      );
    } catch (err) {
      toast.error(err || "Bulk action failed");
    }
  };

  /* ---------- Delete ---------- */
  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(bulkUserAction({ userIds: [deleteTarget._id], action: "delete" })).unwrap();
      toast.success("User deleted");
      setDeleteTarget(null);
      dispatch(
        fetchAllUsers({
          search: debouncedSearch,
          role: roleFilter,
          status: statusFilter,
          sortBy,
          page,
          limit: 10,
        })
      );
    } catch (err) {
      toast.error(err || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const hasActiveFilters =
    search ||
    roleFilter !== "all" ||
    statusFilter !== "all" ||
    sortBy !== "newest" ||
    page > 1;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            👥 User Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage users, roles, and moderation
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatPill icon="👥" label="Total" value={stats.total ?? 0} color="indigo" />
          <StatPill icon="🛡️" label="Admins" value={stats.admins ?? 0} color="purple" />
          <StatPill icon="👤" label="Users" value={stats.users ?? 0} color="green" />
          <StatPill icon="🚫" label="Blocked" value={stats.blocked ?? 0} color="red" />
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="stars-high">Most Stars</option>
              <option value="stars-low">Least Stars</option>
              <option value="name">Name (A-Z)</option>
              <option value="last-active">Last Active</option>
            </select>

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
            Showing <strong className="text-gray-700">{users.length}</strong> of{" "}
            {pagination.totalCount} users
            {search && (
              <>
                {" "}
                for <strong>"{search}"</strong>
              </>
            )}
          </p>
        )}
      </div>

      {/* BULK ACTION BAR */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-600 text-white rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-3 shadow-lg">
          <span className="font-semibold text-sm">
            ✅ {selectedIds.length} user{selectedIds.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              onClick={() => handleBulkAction("unblock")}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition"
            >
              Unblock
            </button>
            <button
              onClick={() => handleBulkAction("block")}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition"
            >
              Block
            </button>
            <button
              onClick={() => setBulkAction("delete")}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-lg text-xs font-semibold transition"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-xs font-medium transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading users...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-12 text-center">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-sm text-red-500 font-medium">Error: {error}</p>
            <button
              onClick={() =>
                dispatch(
                  fetchAllUsers({
                    search: debouncedSearch,
                    role: roleFilter,
                    status: statusFilter,
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

        {!loading && !error && users.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-gray-500 font-medium">
              {hasActiveFilters
                ? "No users match your filters"
                : "No users registered yet"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <>
            <UserTable
              users={users}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onView={(u) => setViewUser(u)}
              onDelete={(u) => setDeleteTarget(u)}
            />
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      {/* TIPS */}
      {!loading && users.length > 0 && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click the user's name to view full details.
            Use checkboxes for bulk actions. Filters persist in URL.
          </p>
        </div>
      )}

      {/* MODALS */}
      {viewUser && (
        <UserDetailModal user={viewUser} onClose={() => setViewUser(null)} />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Delete User?"
          message={`Delete "${deleteTarget.name}"? This will permanently remove the user and all their data.`}
          onConfirm={handleConfirmDelete}
          onClose={() => !deleting && setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {bulkAction === "delete" && (
        <ConfirmDeleteModal
          title="Delete Selected Users?"
          message={`Delete ${selectedIds.length} users permanently? This cannot be undone.`}
          onConfirm={() => handleBulkAction("delete")}
          onClose={() => setBulkAction(null)}
          loading={false}
        />
      )}
    </>
  );
};

export default Users;