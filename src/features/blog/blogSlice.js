import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ============================================================
   Thunks
   ============================================================ */


/* ---------- Public: Fetch by slug ---------- */
export const fetchBlogBySlug = createAsyncThunk(
  "blog/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs/${slug}`);
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Blog not found");
    }
  }
);

/* ---------- Public: Fetch related ---------- */
export const fetchRelatedBlogs = createAsyncThunk(
  "blog/fetchRelated",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/blogs/${slug}/related`);
      return data.blogs;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* ---------- Public: Like ---------- */
export const likeBlog = createAsyncThunk(
  "blog/like",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/blogs/${id}/like`);
      return { id, likes: data.likes };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchBlogs = createAsyncThunk(
  "blog/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        category = "all",
        tag = "",
        sortBy = "newest",
        page = 1,
        limit = 9,
      } = params;

      const query = new URLSearchParams({
        search,
        category,
        tag,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/blogs?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchAllBlogsAdmin = createAsyncThunk(
  "blog/adminAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        status = "all",
        category = "all",
        featured = "all",
        sortBy = "newest",
        page = 1,
        limit = 10,
      } = params;

      const query = new URLSearchParams({
        search,
        status,
        category,
        featured,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/blogs/admin/all?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blog/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const toggleBlogStatus = createAsyncThunk(
  "blog/toggleStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("status", status);
      const { data } = await api.put(`/blogs/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.blog;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/blogs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* ============================================================
   Slice
   ============================================================ */

const initialState = {
  blogs: [],
  adminBlogs: [],
  currentBlog: null,
  relatedBlogs: [],

  // Public pagination
  publicPagination: {
    page: 1,
    limit: 9,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  categories: [],
  featuredBlog: null,

  // Admin pagination
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  stats: { total: 0, published: 0, draft: 0, views: 0, featured: 0 },

  loading: false,
  blogLoading: false,
  creating: false,
  updating: false,
  deleting: false,
  error: null,
  success: false,
};
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearBlogError: (s) => {
      s.error = null;
    },
    clearBlogSuccess: (s) => {
      s.success = false;
    },
    clearCurrentBlog: (s) => {
      s.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch Public ---------- */
      .addCase(fetchBlogs.pending, (s) => {
  s.loading = true;
  s.error = null;
})
.addCase(fetchBlogs.fulfilled, (s, a) => {
  s.loading = false;
  s.blogs = a.payload.blogs;
  s.publicPagination = a.payload.pagination;
  s.categories = a.payload.categories;
  s.featuredBlog = a.payload.featuredBlog;
})
.addCase(fetchBlogs.rejected, (s, a) => {
  s.loading = false;
  s.error = a.payload;
})

      /* ---------- Fetch Admin ---------- */
      .addCase(fetchAllBlogsAdmin.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAllBlogsAdmin.fulfilled, (s, a) => {
        s.loading = false;
        s.adminBlogs = a.payload.blogs;
        s.pagination = a.payload.pagination;
        s.stats = a.payload.stats;
      })
      .addCase(fetchAllBlogsAdmin.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ---------- Create ---------- */
      .addCase(createBlog.pending, (s) => {
        s.creating = true;
        s.error = null;
      })
      .addCase(createBlog.fulfilled, (s, a) => {
        s.creating = false;
        s.success = true;
        s.adminBlogs.unshift(a.payload);
      })
      .addCase(createBlog.rejected, (s, a) => {
        s.creating = false;
        s.error = a.payload;
      })

      /* ---------- Update ---------- */
      .addCase(updateBlog.pending, (s) => {
        s.updating = true;
        s.error = null;
      })
      .addCase(updateBlog.fulfilled, (s, a) => {
        s.updating = false;
        s.success = true;
        const idx = s.adminBlogs.findIndex((b) => b._id === a.payload._id);
        if (idx !== -1) s.adminBlogs[idx] = a.payload;
      })
      .addCase(updateBlog.rejected, (s, a) => {
        s.updating = false;
        s.error = a.payload;
      })

      /* ---------- Toggle Status ---------- */
      .addCase(toggleBlogStatus.fulfilled, (s, a) => {
        const idx = s.adminBlogs.findIndex((b) => b._id === a.payload._id);
        if (idx !== -1) s.adminBlogs[idx] = a.payload;
      })

      /* ---------- Delete ---------- */
      .addCase(deleteBlog.pending, (s) => {
        s.deleting = true;
      })
      .addCase(deleteBlog.fulfilled, (s, a) => {
        s.deleting = false;
        s.adminBlogs = s.adminBlogs.filter((b) => b._id !== a.payload);
        s.blogs = s.blogs.filter((b) => b._id !== a.payload);
        s.pagination.totalCount = Math.max(0, s.pagination.totalCount - 1);
      })
      .addCase(deleteBlog.rejected, (s, a) => {
        s.deleting = false;
        s.error = a.payload;
      })
      /* ---------- Fetch by slug ---------- */
.addCase(fetchBlogBySlug.pending, (s) => {
  s.blogLoading = true;
  s.error = null;
})
.addCase(fetchBlogBySlug.fulfilled, (s, a) => {
  s.blogLoading = false;
  s.currentBlog = a.payload;
})
.addCase(fetchBlogBySlug.rejected, (s, a) => {
  s.blogLoading = false;
  s.error = a.payload;
})

/* ---------- Related ---------- */
.addCase(fetchRelatedBlogs.fulfilled, (s, a) => {
  s.relatedBlogs = a.payload;
})

/* ---------- Like ---------- */
.addCase(likeBlog.fulfilled, (s, a) => {
  if (s.currentBlog && s.currentBlog._id === a.payload.id) {
    s.currentBlog.likes = a.payload.likes;
  }
});
  },
});

export const { clearBlogError, clearBlogSuccess, clearCurrentBlog } =
  blogSlice.actions;
export default blogSlice.reducer;