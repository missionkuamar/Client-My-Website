import { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { uploadProject } from "../../features/project/projectSlice";
import { X, Plus, Star } from "lucide-react";

/* ---------- Constants ---------- */
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;  // 5 MB
const MAX_GALLERY = 20;
const ALLOWED_ZIP = ".zip";

/* ---------- Tech stack suggestions ---------- */
const TECH_SUGGESTIONS = [
  "React", "Next.js", "Vue", "Angular", "Svelte",
  "Node.js", "Express", "Nest.js", "MongoDB", "Mongoose",
  "PostgreSQL", "MySQL", "TailwindCSS", "Bootstrap", "Material UI",
  "Redux", "Zustand", "TypeScript", "JavaScript", "GraphQL",
  "Socket.io", "Firebase", "AWS", "Docker", "Prisma",
];

/* ---------- Format bytes ---------- */
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

const UploadProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploading, error } = useSelector((s) => s.project);

  /* ---------- Refs ---------- */
  const zipInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /* ---------- State ---------- */
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    liveLink: "",
    videoLink: "",
    githubLink: "",
    category: "web",
    isFeatured: false,
  });

  const [zipFile, setZipFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");
  const [success, setSuccess] = useState(false);

  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ============ ZIP ============ */
  const validateZip = (file) => {
    setFileError("");
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(ALLOWED_ZIP)) {
      setFileError("Only .zip files allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`Max ${formatBytes(MAX_FILE_SIZE)} allowed`);
      return;
    }
    setZipFile(file);
  };

  const handleZipInput = (e) => validateZip(e.target.files[0]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) validateZip(e.dataTransfer.files[0]);
  }, []);

  const removeZip = () => {
    setZipFile(null);
    setFileError("");
    if (zipInputRef.current) zipInputRef.current.value = "";
  };

  /* ============ THUMBNAIL ============ */
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
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview("");
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  /* ============ GALLERY ============ */
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

    setGalleryFiles([...galleryFiles, ...validFiles]);
    setGalleryPreviews([...galleryPreviews, ...previews]);
  };

  const removeGalleryImage = (idx) => {
    URL.revokeObjectURL(galleryPreviews[idx]);
    setGalleryFiles(galleryFiles.filter((_, i) => i !== idx));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx));
  };

  /* ============ TECH STACK ============ */
  const addTech = (tech) => {
    const val = (tech || techInput).trim();
    if (!val) return;
    if (techStack.includes(val)) {
      setTechInput("");
      return;
    }
    setTechStack([...techStack, val]);
    setTechInput("");
  };

  const removeTech = (t) => setTechStack(techStack.filter((x) => x !== t));

  /* ============ TAGS ============ */
  const addTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (!val) return;
    if (tags.includes(val)) {
      setTagInput("");
      return;
    }
    setTags([...tags, val]);
    setTagInput("");
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  /* ============ SUBMIT ============ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!zipFile) {
      setFileError("Please select a ZIP file");
      return;
    }

    const fd = new FormData();
    fd.append("title", formData.title.trim());
    fd.append("description", formData.description.trim());
    fd.append("price", formData.price);
    if (formData.originalPrice)
      fd.append("originalPrice", formData.originalPrice);
    if (formData.liveLink) fd.append("liveLink", formData.liveLink);
    if (formData.videoLink) fd.append("videoLink", formData.videoLink);
    if (formData.githubLink) fd.append("githubLink", formData.githubLink);
    if (formData.category) fd.append("category", formData.category);
    fd.append("isFeatured", String(formData.isFeatured));
    fd.append("techStack", techStack.join(","));
    fd.append("tags", tags.join(","));

    // ZIP
    fd.append("zip", zipFile);

    // Thumbnail
    if (thumbnail) fd.append("thumbnail", thumbnail);

    // Gallery (multiple)
    galleryFiles.forEach((file) => fd.append("gallery", file));

    const res = await dispatch(uploadProject(fd));

    if (res.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      toast.success("Project uploaded successfully!");
      setTimeout(() => navigate("/admin/projects"), 1500);
    } else {
      toast.error(res.payload || "Upload failed");
    }
  };

  /* ---------- Validations ---------- */
  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.price !== "" &&
    zipFile;

  /* ==================== SUCCESS SCREEN ==================== */
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl mb-4">
          ✅
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Project Uploaded!
        </h2>
        <p className="text-gray-500">Redirecting to projects list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="mb-6">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-3 transition"
        >
          ← Back to Projects
        </Link>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          📤 Upload New Project
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Add a new project with images, tech stack, and demo links
        </p>
      </div>

      {/* ==================== SERVER ERROR ==================== */}
      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span className="break-words">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ==================== SECTION: BASIC INFO ==================== */}
        <Section title="📝 Basic Information" subtitle="Title, description, and pricing">
          <div className="space-y-4">
            <Field label="Project Title" required>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="e.g., Full Stack E-Commerce Website"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.title.length}/100
              </p>
            </Field>

            <Field label="Description" required>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                maxLength={1500}
                placeholder="Describe your project — features, tech stack, what's included..."
                className={`${inputClass} resize-none`}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.description.length}/1500
              </p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Selling Price (⭐)" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 text-lg">
                    
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={0}
                    max={10000}
                    placeholder="50"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>
              
            </div>

            <Field label="Category">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="web">🌐 Web App</option>
                <option value="mobile">📱 Mobile App</option>
                <option value="ai">🤖 AI/ML</option>
                <option value="ecommerce">🛒 E-Commerce</option>
                <option value="portfolio">💼 Portfolio</option>
                <option value="blog">📝 Blog</option>
                <option value="saas">🚀 SaaS</option>
                <option value="other">📦 Other</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* ==================== SECTION: IMAGES ==================== */}
        <Section
          title="🖼️ Project Images"
          subtitle="One thumbnail + up to 20 gallery images"
        >
          {/* Thumbnail */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail (Main Cover) <span className="text-red-500">*</span>
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
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-sm font-semibold text-gray-700">
                  Click to upload thumbnail
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, WebP · Max {formatBytes(MAX_IMAGE_SIZE)}
                </p>
              </div>
            ) : (
              <div className="relative group inline-block">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  className="w-full max-w-sm h-48 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Gallery Images (up to {MAX_GALLERY})
              </label>
              <span className="text-xs text-gray-500">
                {galleryFiles.length}/{MAX_GALLERY}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
              {/* Existing previews */}
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

              {/* Add button */}
              {galleryFiles.length < MAX_GALLERY && (
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 transition"
                >
                  <Plus size={24} />
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
              Multiple images upload · First image = cover · Max{" "}
              {formatBytes(MAX_IMAGE_SIZE)} each
            </p>
          </div>
        </Section>

        {/* ==================== SECTION: TECH STACK ==================== */}
        <Section
          title="⚙️ Tech Stack"
          subtitle="Which technologies/frameworks used?"
        >
          {/* Selected techs */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="text-indigo-400 hover:text-indigo-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTech();
                }
              }}
              placeholder="Type tech and press Enter (e.g., React)"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => addTech()}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Quick add:</p>
            <div className="flex flex-wrap gap-1.5">
              {TECH_SUGGESTIONS.filter((t) => !techStack.includes(t))
                .slice(0, 15)
                .map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addTech(tech)}
                    className="text-xs bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 px-2.5 py-1 rounded-md transition"
                  >
                    + {tech}
                  </button>
                ))}
            </div>
          </div>
        </Section>

        {/* ==================== SECTION: LINKS ==================== */}
        <Section
          title="🔗 Project Links"
          subtitle="Demo video, live preview, and source code"
        >
          <div className="space-y-4">
            <Field label="Live Demo Link">
              <input
                type="url"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleChange}
                placeholder="https://myproject.vercel.app"
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                🌐 Users can see the live project
              </p>
            </Field>

            <Field label="Video Demo Link (YouTube)">
              <input
                type="url"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">
                🎥 YouTube or any video URL
              </p>
            </Field>

            <Field label="GitHub Repository (optional)">
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        {/* ==================== SECTION: TAGS ==================== */}
        <Section title="🏷️ Tags" subtitle="Help users find your project">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="e.g., ecommerce, fullstack, react"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition"
            >
              Add
            </button>
          </div>
        </Section>

        {/* ==================== SECTION: ZIP ==================== */}
        <Section
          title="📦 Project ZIP File"
          subtitle="Upload your complete project code"
        >
          {!zipFile ? (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => zipInputRef.current?.click()}
              className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : fileError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
              }`}
            >
              <input
                ref={zipInputRef}
                type="file"
                accept=".zip"
                onChange={handleZipInput}
                className="hidden"
              />
              <div className="text-4xl mb-3">{dragActive ? "📥" : "📁"}</div>
              <p className="text-sm font-semibold text-gray-700">
                {dragActive
                  ? "Drop ZIP here"
                  : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ZIP only · Max {formatBytes(MAX_FILE_SIZE)}
              </p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {zipFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatBytes(zipFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={removeZip}
                className="w-8 h-8 rounded-lg hover:bg-red-100 text-red-500 flex items-center justify-center transition"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {fileError && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <span>⚠️</span> {fileError}
            </p>
          )}
        </Section>

        {/* ==================== SECTION: OPTIONS ==================== */}
        <Section title="⚡ Options" subtitle="Extra settings">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
            <div>
              <p className="text-sm font-medium text-gray-800">
                ⭐ Feature this project
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Featured projects appear at the top
              </p>
            </div>
          </label>
        </Section>

        {/* ==================== ACTIONS ==================== */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => navigate("/admin/projects")}
            disabled={uploading}
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !isFormValid}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Uploading to S3...
              </>
            ) : (
              <>📤 Publish Project</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ---------- Helper components ---------- */
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

const inputClass =
  "w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition";

export default UploadProject;