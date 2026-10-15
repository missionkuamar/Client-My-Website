import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ============================================================
   Thunks
   ============================================================ */

export const fetchOverviewStats = createAsyncThunk(
  "analytics/overview",
  async (range = "month", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/analytics/overview?range=${range}`);
      return data.stats;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchRevenueChart = createAsyncThunk(
  "analytics/revenue",
  async (range = "month", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/analytics/revenue?range=${range}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchUserGrowthChart = createAsyncThunk(
  "analytics/usersGrowth",
  async (range = "month", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/analytics/users-growth?range=${range}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchSalesChart = createAsyncThunk(
  "analytics/sales",
  async (range = "month", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/analytics/sales?range=${range}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchTopProjects = createAsyncThunk(
  "analytics/topProjects",
  async (range = "month", { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/analytics/top-projects?range=${range}`);
      return data.projects;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const fetchRoleDistribution = createAsyncThunk(
  "analytics/roles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/roles");
      return data.distribution;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* ============================================================
   Slice
   ============================================================ */

const initialState = {
  range: "month", // global filter

  stats: {
    totalRevenue: 0,
    totalUsers: 0,
    totalProjects: 0,
    totalDownloads: 0,
    totalOrders: 0,
    totalStars: 0,
  },

  revenueData: [],
  userGrowthData: [],
  salesData: [],
  topProjects: [],
  roleDistribution: [],

  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setRange: (state, action) => {
      state.range = action.payload;
    },
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    

      /* ---------- Overview ---------- */
      .addCase(fetchOverviewStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })

      /* ---------- Revenue ---------- */
      .addCase(fetchRevenueChart.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueData = action.payload;
      })

      /* ---------- User Growth ---------- */
      .addCase(fetchUserGrowthChart.fulfilled, (state, action) => {
        state.loading = false;
        state.userGrowthData = action.payload;
      })

      /* ---------- Sales ---------- */
      .addCase(fetchSalesChart.fulfilled, (state, action) => {
        state.loading = false;
        state.salesData = action.payload;
      })

      /* ---------- Top Projects ---------- */
      .addCase(fetchTopProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.topProjects = action.payload;
      })

      /* ---------- Role Distribution ---------- */
      .addCase(fetchRoleDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.roleDistribution = action.payload;
      })
        /* ---------- Loading state for any fetch ---------- */
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
  },
});

export const { setRange, clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;