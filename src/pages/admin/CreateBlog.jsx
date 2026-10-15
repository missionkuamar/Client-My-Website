import { useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { X, Plus, Link as LinkIcon, GitBranch, ImagePlus } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { createBlog } from "../../features/blog/blogSlice";

/* ---------- Constants ---------- */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_GALLERY = 20;

/* ---------- Helpers ---------- */
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const CATEGORIES = [
  { value: "tutorial", label: "📚 Tutorial" },
  { value: "news", label: "📰 News" },
  { value: "review", label: "⭐ Review" },
  { value: "guide", label: "🗺️ Guide" },
  { value: "case-study", label: "📊 Case Study" },
  { value: "other", label: "📦 Other" },
];

const CreateBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creating, error } = useSelector((s) => s.blog);

  /* ---------- Refs ---------- */
  const thumbInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /* ---------- Form State ---------- */
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: "",
    status: "draft",
    liveLink: "",
    videoLink: "",
    githubLink: "",
    category: "tutorial",
    isFeatured: false,
    readTime: 5,
  });

  /* ---------- File State ---------- */
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [success, setSuccess] = useState(false);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ============ Thumbnail ============ */
  const handleThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(`Max ${formatBytes(MAX_IMAGE_SIZE)} per image`);
      return;
    }
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnail(null);
    setThumbnailPreview("");
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  /* ============ Gallery ============ */
  const handleGallery = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_GALLERY - galleryFiles.length;
    const toAdd = files.slice(0, remaining);

    const validFiles = [];
    const previews = [];

    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_IMAGE_SIZE) continue;
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setGalleryFiles((prev) => [...prev, ...validFiles]);
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeGalleryImage = (idx) => {
    URL.revokeObjectURL(galleryPreviews[idx]);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ============ Submit ============ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", formData.title.trim());
    fd.append("excerpt", formData.excerpt.trim());
    fd.append("content", formData.content.trim());
    fd.append("tags", formData.tags);
    fd.append("status", formData.status);
    fd.append("liveLink", formData.liveLink.trim());
    fd.append("videoLink", formData.videoLink.trim());
    fd.append("githubLink", formData.githubLink.trim());
    fd.append("category", formData.category);
    fd.append("isFeatured", String(formData.isFeatured));
    fd.append("readTime", String(formData.readTime));

    if (thumbnail) fd.append("thumbnail", thumbnail);
    galleryFiles.forEach((file) => fd.append("gallery", file));

    const res = await dispatch(createBlog(fd));

    if (res.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      toast.success("Blog created successfully!");
      setTimeout(() => navigate("/admin/blogs"), 1200);
    } else {
      toast.error(res.payload || "Failed to create blog");
    }
  };

  /* ---------- Validation ---------- */
  const isFormValid =
    formData.title.trim() &&
    formData.excerpt.trim() &&
    formData.content.trim();

  /* ---------- Tag preview ---------- */
  const tagList = useMemo(
    () =>
      formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [formData.tags]
  );

  /* ==================== SUCCESS SCREEN ==================== */
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center text-3xl sm:text-4xl mb-4">
          ✅
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Blog Created!
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Redirecting to blogs list...
        </p>
      </div>
    );
  }

  /* ==================== MAIN RENDER ==================== */
  const inputClass =
    "w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition";

  return (
    <>
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-5 sm:mb-6">
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-indigo-600 mb-2 sm:mb-3 transition"
        >
          ← Back to Blogs
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          ✍️ Create New Blog
        </h1>
        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
          Share your knowledge with the community
        </p>
      </div>

      {/* ==================== GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* ---------- FORM (2 cols) ---------- */}
        <div className="lg:col-span-2 space-y-5">
          {/* ============ SERVER ERROR ============ */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs sm:text-sm flex items-start gap-2">
              <span>⚠️</span>
              <span className="break-words">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ============ BASIC INFO ============ */}
            <Section title="📝 Basic Information" subtitle="Title, excerpt, category">
              <div className="space-y-4">
                <Field label="Title" required>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="e.g., How to Build a MERN Stack App"
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.title.length}/150
                  </p>
                </Field>

                <Field label="Excerpt" required>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                    rows={2}
                    maxLength={300}
                    placeholder="Short summary shown in blog list..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.excerpt.length}/300
                  </p>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Category">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Read Time (minutes)">
                    <input
                      type="number"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      min={1}
                      max={60}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            {/* ============ CONTENT ============ */}
            <Section title="📄 Blog Content" subtitle="Markdown supported">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={14}
                placeholder="# Heading&#10;&#10;Write your blog content here...&#10;&#10;- Point 1&#10;- Point 2&#10;&#10;**Bold text** and *italic text*"
                className={`${inputClass} resize-y font-mono text-xs sm:text-sm`}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.content.length} characters
              </p>
            </Section>

            {/* ============ IMAGES ============ */}
            <Section
              title="🖼️ Blog Images"
              subtitle="Thumbnail (required for cards) + gallery (up to 20)"
            >
              {/* Thumbnail */}
              <div className="mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Thumbnail (Main Cover)
                </label>

                {!thumbnail ? (
                  <div
                    onClick={() => thumbInputRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-6 text-center transition hover:bg-gray-50"
                  >
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnail}
                      className="hidden"
                    />
                    <ImagePlus size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-gray-700">
                      Click to upload thumbnail
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, WebP · Max {formatBytes(MAX_IMAGE_SIZE)}
                    </p>
                  </div>
                ) : (
                  <div className="relative inline-block w-full max-w-sm">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail"
                      className="w-full h-44 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      {thumbnail.name} · {formatBytes(thumbnail.size)}
                    </p>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Gallery Images
                  </label>
                  <span className="text-xs text-gray-500">
                    {galleryFiles.length}/{MAX_GALLERY}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                  {galleryPreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={preview}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {galleryFiles.length < MAX_GALLERY && (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 transition"
                    >
                      <Plus size={22} />
                      <span className="text-[10px] mt-1 font-medium">Add</span>
                    </button>
                  )}
                </div>

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGallery}
                  className="hidden"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Multiple images allowed · Max {formatBytes(MAX_IMAGE_SIZE)} each
                </p>
              </div>
            </Section>

            {/* ============ TAGS ============ */}
            <Section title="🏷️ Tags" subtitle="Help readers find your blog">
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="react, mern, tutorial, javascript"
                className={inputClass}
              />
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tagList.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Section>

            {/* ============ LINKS ============ */}
            <Section
              title="🔗 Links (Optional)"
              subtitle="Add demo, video, or source code links"
            >
              <div className="space-y-4">
                <Field label="Live Demo Link">
                  <div className="relative">
                    <LinkIcon
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="url"
                      name="liveLink"
                      value={formData.liveLink}
                      onChange={handleChange}
                      placeholder="https://myproject.vercel.app"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="Video Demo (YouTube)">
                  <div className="relative">
                    <FaYoutube
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
                    />
                    <input
                      type="url"
                      name="videoLink"
                      value={formData.videoLink}
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>

                <Field label="GitHub Repository">
                  <div className="relative">
                    <GitBranch
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                    />
                    <input
                      type="url"
                      name="githubLink"
                      value={formData.githubLink}
                      onChange={handleChange}
                      placeholder="https://github.com/username/repo"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            {/* ============ STATUS & OPTIONS ============ */}
            <Section title="⚡ Status & Options" subtitle="Save as draft or publish">
              <div className="flex gap-2 sm:gap-3 mb-4">
                {[
                  { value: "draft", label: "📝 Draft", desc: "Save as draft" },
                  {
                    value: "published",
                    label: "✅ Published",
                    desc: "Live for everyone",
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: opt.value }))
                    }
                    className={`flex-1 p-3 rounded-lg border-2 text-left transition ${
                      formData.status === opt.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        formData.status === opt.value
                          ? "text-indigo-700"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-indigo-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    ⭐ Feature this blog
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Featured blogs appear at the top
                  </p>
                </div>
              </label>
            </Section>

            {/* ============ ACTIONS ============ */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/blogs")}
                disabled={creating}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || !isFormValid}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Creating...
                  </>
                ) : (
                  <>✍️ Create Blog</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ---------- PREVIEW (1 col) ---------- */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 p-4 sm:p-5 bg-gray-50/50">
              <h3 className="text-sm font-semibold text-gray-800">
                👁️ Live Preview
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                See how your blog will look
              </p>
            </div>

            <div className="p-4 sm:p-5">
              {/* Cover Image */}
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Cover"
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              ) : formData.liveLink ? null : (
                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl mb-3">
                  📄
                </div>
              )}

              {/* Status badge */}
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-2 ${
                  formData.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {formData.status === "published"
                  ? "✅ Published"
                  : "📝 Draft"}
              </span>

              {/* Category */}
              {formData.category && (
                <span className="ml-1 inline-block text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium capitalize mb-2">
                  {formData.category}
                </span>
              )}

              {/* Title */}
              <h4 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
                {formData.title || "Your blog title will appear here"}
              </h4>

              {/* Excerpt */}
              <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                {formData.excerpt ||
                  "Your blog excerpt will appear here. This is what users see in the blog list."}
              </p>

              {/* Tags */}
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {tagList.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {tagList.length > 4 && (
                    <span className="text-[10px] text-gray-400">
                      +{tagList.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100">
                <span>📅 Just now</span>
                <span>👁️ 0 views</span>
                <span>⏱️ {formData.readTime} min</span>
              </div>

              {/* Gallery count */}
              {galleryFiles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                  <ImagePlus size={14} />
                  {galleryFiles.length} gallery image
                  {galleryFiles.length !== 1 ? "s" : ""}
                </div>
              )}

              {/* Links count */}
              {(formData.liveLink || formData.videoLink || formData.githubLink) && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {formData.liveLink && (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                      🌐 Live
                    </span>
                  )}
                  {formData.videoLink && (
                    <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md">
                      🎥 Video
                    </span>
                  )}
                  {formData.githubLink && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                      💻 GitHub
                    </span>
                  )}
                </div>
              )}

              {/* Content preview */}
              {formData.content && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Content Preview
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-6 whitespace-pre-wrap">
                    {formData.content}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-5 sm:mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs sm:text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              💡 Writing tips
            </h3>
            <ul className="text-xs text-blue-700 space-y-1.5 leading-relaxed">
              <li>• Keep title under 60 chars for SEO</li>
              <li>• Thumbnail: 1200x630 recommended</li>
              <li>• Use markdown for formatting</li>
              <li>• Add 3-5 relevant tags</li>
              <li>• Preview before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------- Helper Components ---------- */
const Section = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="border-b border-gray-100 p-4 sm:p-5 bg-gray-50/50">
      <h2 className="text-sm sm:text-base font-semibold text-gray-800">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      )}
    </div>
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default CreateBlog;