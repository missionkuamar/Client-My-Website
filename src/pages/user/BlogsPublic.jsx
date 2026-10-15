import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchBlogs } from "../../features/blog/blogSlice";
import {
  Search,
  Clock,
  Eye,
  Heart,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";

/* ============ Debounce Hook ============ */
function useDebounce(value, delay = 400) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

/* ============ Blog Card ============ */
const BlogCard = ({ blog }) => (
  <Link
    to={`/blog/${blog.slug}`}
    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition flex flex-col"
  >
    {blog.thumbnail ? (
      <img
        src={blog.thumbnail}
        alt={blog.title}
        loading="lazy"
        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
      />
    ) : (
      <div className="w-full h-44 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl">
        📄
      </div>
    )}

    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
          {blog.category || "Article"}
        </span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <Clock size={10} /> {blog.readTime || 5} min
        </span>
        {blog.isFeatured && (
          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
            ⭐
          </span>
        )}
      </div>

      <h3 className="text-base font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-indigo-600 transition">
        {blog.title}
      </h3>

      <p className="text-sm text-gray-500 line-clamp-3 mb-3 flex-1">
        {blog.excerpt}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Eye size={12} /> {blog.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} /> {blog.likes || 0}
          </span>
        </div>
        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          Read <ArrowRight size={12} />
        </span>
      </div>
    </div>
  </Link>
);

/* ============ Featured Blog Hero ============ */
const FeaturedBlog = ({ blog }) => (
  <Link
    to={`/blog/${blog.slug}`}
    className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition mb-8"
  >
    <div className="grid grid-cols-1 md:grid-cols-2">
      {blog.thumbnail ? (
        <img
          src={blog.thumbnail}
          alt={blog.title}
          loading="lazy"
          className="w-full h-56 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-56 md:h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-6xl">
          ⭐
        </div>
      )}
      <div className="p-6 md:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
            ⭐ FEATURED
          </span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-semibold uppercase">
            {blog.category}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {blog.excerpt}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {blog.readTime || 5} min
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} /> {blog.views || 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} /> {blog.likes || 0}
          </span>
        </div>
      </div>
    </div>
  </Link>
);

/* ============ Pagination ============ */
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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
      <p className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        Showing <strong className="text-gray-700">{startItem}</strong>–
        <strong className="text-gray-700">{endItem}</strong> of{" "}
        <strong className="text-gray-700">{totalCount}</strong> articles
      </p>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition"
          aria-label="Previous"
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
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

/* ============ Main Component ============ */
const BlogsPublic = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);

  const {
    blogs = [],
    publicPagination = { page: 1, totalPages: 0, totalCount: 0, limit: 9 },
    categories = [],
    featuredBlog,
    loading,
    error,
  } = useSelector((s) => s.blog);

  /* ---------- Filter state (URL synced) ---------- */
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "all"
  );
  const [tagFilter, setTagFilter] = useState(searchParams.get("tag") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 400);

  /* ---------- Fetch on any filter change ---------- */
  useEffect(() => {
    dispatch(
      fetchBlogs({
        search: debouncedSearch,
        category: categoryFilter,
        tag: tagFilter,
        sortBy,
        page,
        limit: 9,
      })
    );
  }, [dispatch, debouncedSearch, categoryFilter, tagFilter, sortBy, page]);

  /* ---------- URL sync ---------- */
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (categoryFilter !== "all") params.category = categoryFilter;
    if (tagFilter) params.tag = tagFilter;
    if (sortBy !== "newest") params.sort = sortBy;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    categoryFilter,
    tagFilter,
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
  }, [debouncedSearch, categoryFilter, tagFilter, sortBy]);

  /* ---------- Handlers ---------- */
  const handlePageChange = (p) => {
    if (p < 1 || p > publicPagination.totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClear = () => {
    setSearch("");
    setCategoryFilter("all");
    setTagFilter("");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    categoryFilter !== "all" ||
    tagFilter ||
    sortBy !== "newest" ||
    page > 1;

  /* ==================== RENDER ==================== */
  return (
    <>
      {/* ==================== HERO ==================== */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            📝 Our Blog
          </h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto">
            Discover tutorials, guides, and insights from our team
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mt-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search blogs by title, tag, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-xl text-gray-800 text-sm focus:ring-2 focus:ring-white/50 outline-none shadow-lg"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Featured Blog (only page 1, no filters) */}
        {!loading &&
          featuredBlog &&
          page === 1 &&
          !debouncedSearch &&
          categoryFilter === "all" &&
          !tagFilter && <FeaturedBlog blog={featuredBlog} />}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Category chips */}
            <div className="flex-1 flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  categoryFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategoryFilter(cat.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize flex items-center gap-1 ${
                    categoryFilter === cat.name
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                  <span
                    className={`text-[10px] px-1 rounded-full ${
                      categoryFilter === cat.name
                        ? "bg-white/20"
                        : "bg-gray-200"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort + Clear */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Viewed</option>
                <option value="liked">Most Liked</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Active tag */}
          {tagFilter && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">Filtered by tag:</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-medium flex items-center gap-1.5">
                #{tagFilter}
                <button
                  onClick={() => setTagFilter("")}
                  className="hover:text-indigo-900"
                >
                  <X size={12} />
                </button>
              </span>
            </div>
          )}

          {!loading && (
            <p className="text-xs text-gray-500 mt-3">
              Showing <strong className="text-gray-700">{blogs.length}</strong> of{" "}
              {publicPagination.totalCount} articles
              {debouncedSearch && (
                <>
                  {" "}
                  for "<strong>{debouncedSearch}</strong>"
                </>
              )}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-16 text-center">
            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-500">Loading blogs...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-12 text-center bg-white rounded-2xl border border-red-200">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="text-sm text-red-500 font-medium">Error: {error}</p>
            <button
              onClick={() =>
                dispatch(
                  fetchBlogs({
                    search: debouncedSearch,
                    category: categoryFilter,
                    tag: tagFilter,
                    sortBy,
                    page,
                    limit: 9,
                  })
                )
              }
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && blogs.length === 0 && (
          <div className="p-16 text-center bg-white rounded-2xl border border-gray-200">
            <p className="text-5xl mb-3">📭</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              No blogs found
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {hasActiveFilters
                ? "Try adjusting your search or filters"
                : "No blogs published yet"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Blog grid */}
        {!loading && !error && blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            <Pagination
              pagination={publicPagination}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default BlogsPublic;