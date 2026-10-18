import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ============================
// Async Thunks
// ============================

// Fetch all projects (public)
export const fetchProjects = createAsyncThunk(
  "project/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        category = "all",
        priceFilter = "all",
        sortBy = "newest",
        page = 1,
        limit = 9,
      } = params;

      const query = new URLSearchParams({
        search,
        category,
        priceFilter,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/projects?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// Fetch single project by id
export const fetchProjectById = createAsyncThunk(
  "project/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      return {
        project: data.project,
        isPurchased: data.isPurchased,
        isExpired: data.isExpired,       // ⬅️ NEW
        expiresAt: data.expiresAt,       // ⬅️ NEW
        daysRemaining: data.daysRemaining, // ⬅️ NEW
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// Admin: Upload project (formData with zip)
export const uploadProject = createAsyncThunk(
  "project/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/projects/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.project;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

// User: Buy project with stars
export const buyProject = createAsyncThunk(
  "project/buy",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/projects/${projectId}/buy`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Purchase failed");
    }
  }
);

// User: Download project (returns signed URL)
export const downloadProject = createAsyncThunk(
  "project/download",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/projects/${projectId}/download`);
      return data.downloadUrl;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Download failed");
    }
  }
);


// Update project
export const updateProject = createAsyncThunk(
  "project/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { data: res } = await api.put(`/projects/${id}`, data);
      return res.project;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "project/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);
// User: My purchased projects
export const fetchMyPurchases = createAsyncThunk(
  "project/myPurchases",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        priceFilter = "all",
        sortBy = "newest",
        page = 1,
        limit = 10,
      } = params;

      const query = new URLSearchParams({
        search,
        priceFilter,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/projects/my-purchases?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// Admin: My uploaded projects
export const fetchMyUploads = createAsyncThunk(
  "project/myUploads",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        priceFilter = "all",
        sortBy = "newest",
        page = 1,
        limit = 10,
      } = params;

      const query = new URLSearchParams({
        search,
        priceFilter,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/projects/my-uploads?${query}`);
      // console.log("Fetched my uploads:", data.projects); // Debugging log
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// Admin: Delete project

// ============================
// Initial State
// ============================
const initialState = {
  projects: [],
  currentProject: null,
  isPurchased: false,
  purchases: [],
  myUploads: [],

  // Public pagination
  publicPagination: {
    page: 1,
    limit: 9,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  publicStats: { total: 0, featured: 0, free: 0 },
  categories: [],
 purchasesPagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  purchasesStats: {
    total: 0,
    starsSpent: 0,
  },
  // Admin pagination
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  loading: false,
  uploading: false,
  buying: false,
  downloading: false,
  error: null,
  success: false,
};

// ============================
// Slice
// ============================
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.isPurchased = false;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- Fetch All ----------
    .addCase(fetchProjects.pending, (s) => {
  s.loading = true;
  s.error = null;
})
.addCase(fetchProjects.fulfilled, (s, a) => {
  s.loading = false;
  s.projects = a.payload.projects;
  s.publicPagination = a.payload.pagination;
  s.publicStats = a.payload.stats;
  s.categories = a.payload.categories;
})
.addCase(fetchProjects.rejected, (s, a) => {
  s.loading = false;
  s.error = a.payload;
})

      // ---------- Fetch One ----------
      .addCase(fetchProjectById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (s, a) => {
  s.loading = false;
  s.currentProject = a.payload.project;
  s.isPurchased = a.payload.isPurchased;
  s.isExpired = a.payload.isExpired;
  s.expiresAt = a.payload.expiresAt;
  s.daysRemaining = a.payload.daysRemaining;
})
      .addCase(fetchProjectById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // ---------- Upload ----------
      .addCase(uploadProject.pending, (s) => {
        s.uploading = true;
        s.error = null;
      })
      .addCase(uploadProject.fulfilled, (s, a) => {
        s.uploading = false;
        s.success = true;
        s.projects.unshift(a.payload);
        s.myUploads.unshift(a.payload);
      })
      .addCase(uploadProject.rejected, (s, a) => {
        s.uploading = false;
        s.error = a.payload;
      })

      // ---------- Buy ----------
      .addCase(buyProject.pending, (s) => {
        s.buying = true;
        s.error = null;
      })
      .addCase(buyProject.fulfilled, (s, a) => {
        s.buying = false;
        s.isPurchased = true;
        s.success = true;
        // Update user stars in localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user && a.payload.remainingStars !== undefined) {
          user.stars = a.payload.remainingStars;
          localStorage.setItem("user", JSON.stringify(user));
        }
      })
      .addCase(buyProject.rejected, (s, a) => {
        s.buying = false;
        s.error = a.payload;
      })

      // ---------- Download ----------
      .addCase(downloadProject.pending, (s) => {
        s.downloading = true;
        s.error = null;
      })
      .addCase(downloadProject.fulfilled, (s) => {
        s.downloading = false;
      })
      .addCase(downloadProject.rejected, (s, a) => {
        s.downloading = false;
        s.error = a.payload;
      })

      // ---------- My Purchases ----------
      .addCase(fetchMyPurchases.pending, (s) => {
  s.loading = true;
  s.error = null;
})
.addCase(fetchMyPurchases.fulfilled, (s, a) => {
  s.loading = false;
  s.purchases = a.payload.purchases;
  s.purchasesPagination = a.payload.pagination;
  s.purchasesStats = a.payload.stats;
})
.addCase(fetchMyPurchases.rejected, (s, a) => {
  s.loading = false;
  s.error = a.payload;
})

      // ---------- My Uploads ----------
      .addCase(fetchMyUploads.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchMyUploads.fulfilled, (s, a) => {
        s.loading = false;
        s.myUploads = a.payload.projects;
        s.pagination = a.payload.pagination;
        s.stats = a.payload.stats;
      })
      .addCase(fetchMyUploads.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

     
      .addCase(updateProject.fulfilled, (s, a) => {
  const idx = s.myUploads.findIndex((p) => p._id === a.payload._id);
  if (idx !== -1) s.myUploads[idx] = a.payload;
  const idx2 = s.projects.findIndex((p) => p._id === a.payload._id);
  if (idx2 !== -1) s.projects[idx2] = a.payload;
  s.success = true;
})
.addCase(deleteProject.fulfilled, (s, a) => {
  s.myUploads = s.myUploads.filter((p) => p._id !== a.payload);
  s.projects = s.projects.filter((p) => p._id !== a.payload);
  s.pagination.totalCount = Math.max(0, s.pagination.totalCount - 1);
})
  },
});

// ============================
// Exports
// ============================
export const { clearProjectError, clearCurrentProject, clearSuccess } =
  projectSlice.actions;

// ⬇️ YE LINE ZAROORI HAI
export default projectSlice.reducer;