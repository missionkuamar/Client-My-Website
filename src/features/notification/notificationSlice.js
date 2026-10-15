import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ---------- Thunks ---------- */

export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        filter = "all",
        type = "all",
        page = 1,
        limit = 10,
      } = params;

      const query = new URLSearchParams({
        search,
        filter,
        type,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/notifications?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notification/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/notifications/${id}/read`);
      return data.notification;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.put("/notifications/read-all");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  "notification/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/notifications/clear-all");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* ---------- Slice ---------- */

const initialState = {
  notifications: [],
  unreadCount: 0,

  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  // Global stats (unfiltered)
  stats: {
    total: 0,
    unread: 0,
    read: 0,
  },

  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotificationError: (s) => {
      s.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.loading = false;
        s.notifications = a.payload.notifications;
        s.pagination = a.payload.pagination;
        s.stats = a.payload.stats;
        s.unreadCount = a.payload.stats.unread;
      })
      .addCase(fetchNotifications.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(markNotificationRead.fulfilled, (s, a) => {
        const idx = s.notifications.findIndex((n) => n._id === a.payload._id);
        if (idx !== -1) {
          s.notifications[idx] = a.payload;
          s.unreadCount = Math.max(0, s.unreadCount - 1);
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (s) => {
        s.notifications = s.notifications.map((n) => ({ ...n, isRead: true }));
        s.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (s, a) => {
        const removed = s.notifications.find((n) => n._id === a.payload);
        s.notifications = s.notifications.filter((n) => n._id !== a.payload);
        if (removed && !removed.isRead) {
          s.unreadCount = Math.max(0, s.unreadCount - 1);
        }
      })
      .addCase(clearAllNotifications.fulfilled, (s) => {
        s.notifications = [];
        s.unreadCount = 0;
      });
  },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;