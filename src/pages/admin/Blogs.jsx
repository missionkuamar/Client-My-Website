import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchAllBlogsAdmin,
  deleteBlog,
  toggleBlogStatus,
} from "../../features/blog/blogSlice";
import BlogViewModal from "../../components/admin/BlogViewModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import { Eye, Trash2, Edit, CheckCircle2, XCircle, Star } from "lucide-react";

/* ---------- Debounce ---------- */
function useDebounce(value, delay = 400) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

/* ---------- Stat Pill ---------- */
const StatPill = ({ icon, label, value, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${colors[color]}`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}:</span>
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
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
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

  const Chevron = ({ dir }) => (
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
          <Chevron dir="left" />
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
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Component ---------- */
const Blogs = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    adminBlogs = [],
    pagination = { page: 1, totalPages: 0, totalCount: 0, limit: 10 },
    stats = {},
    loading,
    error,
  } = useSelector((s) => s.blog);

  /* ---------- Filters ---------- */
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [featuredFilter, setFeaturedFilter] = useState(
    searchParams.get("featured") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 400);
  const isFirstRender = useRef(true);

  /* ---------- Modals ---------- */
  const [viewBlog, setViewBlog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    dispatch(
      fetchAllBlogsAdmin({
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter,
        featured: featuredFilter,
        sortBy,
        page,
        limit: 10,
      })
    );
  }, [
    dispatch,
    debouncedSearch,
    statusFilter,
    categoryFilter,
    featuredFilter,
    sortBy,
    page,
  ]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (statusFilter !== "all") params.status = statusFilter;
    if (categoryFilter !== "all") params.category = categoryFilter;
    if (featuredFilter !== "all") params.featured = featuredFilter;
    if (sortBy !== "newest") params.sort = sortBy;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    statusFilter,
    categoryFilter,
    featuredFilter,
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
  }, [debouncedSearch, statusFilter, categoryFilter, featuredFilter, sortBy]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (p) => {
    if (p < 1 || p > pagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setFeaturedFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      await dispatch(
        toggleBlogStatus({ id: blog._id, status: newStatus })
      ).unwrap();
      toast.success(
        newStatus === "published" ? "Blog published!" : "Blog moved to draft"
      );
    } catch (err) {
      toast.error(err || "Failed to toggle status");
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteBlog(deleteTarget._id)).unwrap();
      toast.success("Blog deleted");
      setDeleteTarget(null);
      if (adminBlogs.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      toast.error(err || "Delete failed");
    } finally {
      setDeleting(false);
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
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    featuredFilter !== "all" ||
    sortBy !== "newest" ||
    page > 1;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* HEADER */}
      <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            📝 Blogs
          </h1>
          <p className="text-gray-500 mt-1 text-xs sm:text-sm">
            Manage your blog posts and articles
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatPill icon="📚" label="Total" value={stats.total ?? 0} color="indigo" />
          <StatPill
            icon="✅"
            label="Published"
            value={stats.published ?? 0}
            color="green"
          />
          <StatPill
            icon="📝"
            label="Drafts"
            value={stats.draft ?? 0}
            color="yellow"
          />
          <StatPill
            icon="👁️"
            label="Views"
            value={stats.views ?? 0}
            color="purple"
          />
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5 sm:mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title, excerpt, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
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

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="published">✅ Published</option>
              <option value="draft">📝 Draft</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="tutorial">📚 Tutorial</option>
              <option value="news">📰 News</option>
              <option value="review">⭐ Review</option>
              <option value="guide">🗺️ Guide</option>
              <option value="case-study">📊 Case Study</option>
              <option value="other">📦 Other</option>
            </select>

            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">All Blogs</option>
              <option value="yes">⭐ Featured</option>
              <option value="no">Regular</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="views-high">Most Views</option>
              <option value="views-low">Least Views</option>
              <option value="title">Title (A-Z)</option>
              <option value="read-time">Longest Read</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="px-3 sm:px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                ✕ Clear
              </button>
            )}

            <Link
              to="/admin/create-blog"
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition text-center"
            >
              ✍️ Create New
            </Link>
          </div>
        </div>

        {!loading && (
          <p className="text-xs text-gray-500 mt-3">
            Showing <strong className="text-gray-700">{adminBlogs.length}</strong> of{" "}
            {pagination.totalCount} blogs
            {search && (
              <>
                {" "}
                for <strong>"{search}"</strong>
              </>
            )}
          </p>
        )}
      </div>

      {/* BLOG LIST */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && (
          <div className="p-10 sm:p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading blogs...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-10 sm:p-12 text-center">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-sm text-red-500 font-medium">Error: {error}</p>
            <button
              onClick={() =>
                dispatch(
                  fetchAllBlogsAdmin({
                    search: debouncedSearch,
                    status: statusFilter,
                    category: categoryFilter,
                    featured: featuredFilter,
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

        {!loading && !error && adminBlogs.length === 0 && !hasActiveFilters && (
          <div className="p-10 sm:p-12 text-center">
            <p className="text-5xl mb-3">📝</p>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
              No blogs yet
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-5">
              Start sharing your knowledge with the world.
            </p>
            <Link
              to="/admin/create-blog"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              ✍️ Write Your First Blog
            </Link>
          </div>
        )}

        {!loading && !error && adminBlogs.length === 0 && hasActiveFilters && (
          <div className="p-10 sm:p-12 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-gray-500 font-medium">
              {search ? `No results for "${search}"` : "No blogs match your filters"}
            </p>
            <button
              onClick={handleClear}
              className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && adminBlogs.length > 0 && (
          <>
            <div className="divide-y divide-gray-100">
              {adminBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="p-4 sm:p-5 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
                    {/* Thumbnail */}
                    {blog.thumbnail ? (
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                        📄
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <button
                          onClick={() => setViewBlog(blog)}
                          className="font-semibold text-gray-800 text-sm sm:text-base text-left hover:text-indigo-600 transition truncate"
                        >
                          {blog.title}
                        </button>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {blog.status === "published" ? "✅ Published" : "📝 Draft"}
                        </span>
                        {blog.isFeatured && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            ⭐ Featured
                          </span>
                        )}
                        {blog.category && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                            {blog.category}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-2">
                        {blog.excerpt || "No excerpt"}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>👁️ {blog.views || 0} views</span>
                        <span>📅 {formatDate(blog.createdAt)}</span>
                        <span>⏱️ {blog.readTime || 5} min</span>
                        {blog.tags?.length > 0 && (
                          <span>
                            🏷️ {blog.tags.slice(0, 2).join(", ")}
                            {blog.tags.length > 2 && ` +${blog.tags.length - 2}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleToggleStatus(blog)}
                        title={blog.status === "published" ? "Unpublish" : "Publish"}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                          blog.status === "published"
                            ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                            : "bg-green-50 text-green-600 hover:bg-green-500 hover:text-white"
                        }`}
                      >
                        {blog.status === "published" ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                      </button>

                      <button
                        onClick={() => setViewBlog(blog)}
                        title="View"
                        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center justify-center transition"
                      >
                        <Eye size={16} />
                      </button>

                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        title="Open public view"
                        className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition"
                      >
                        ↗
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(blog)}
                        title="Delete"
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>

      {/* TIPS */}
      {!loading && adminBlogs.length > 0 && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click blog title to view full details.
            Use ✅/❌ to publish/unpublish quickly. Filters persist in URL.
          </p>
        </div>
      )}

      {/* MODALS */}
      {viewBlog && (
        <BlogViewModal
          blog={viewBlog}
          onClose={() => setViewBlog(null)}
          onEdit={(b) => {
            setViewBlog(null);
            // Navigate to edit page (future)
            toast.success(`Edit mode coming soon for: ${b.title}`);
          }}
          onDelete={(b) => {
            setViewBlog(null);
            setDeleteTarget(b);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Delete Blog?"
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onClose={() => !deleting && setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
};

export default Blogs;