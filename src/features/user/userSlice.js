import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/* ============================================================
   Thunks
   ============================================================ */

export const fetchAllUsers = createAsyncThunk(
  "user/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        role = "all",
        status = "all",
        sortBy = "newest",
        page = 1,
        limit = 10,
      } = params;

      const query = new URLSearchParams({
        search,
        role,
        status,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/users?${query}`);
      // console.log("Fetched users:", data); // Debugging log
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);


/* ============================================================
   Thunks
   ============================================================ */

// Get daily bonus status
export const fetchDailyBonusStatus = createAsyncThunk(
  "user/dailyBonusStatus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/daily-bonus");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// Claim daily bonus
export const claimDailyBonus = createAsyncThunk(
  "user/claimDailyBonus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/daily-bonus/claim");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Claim failed");
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/details",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "user/updateRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${userId}/role`, { role });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const adjustUserStars = createAsyncThunk(
  "user/adjustStars",
  async ({ userId, amount, action }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${userId}/stars`, {
        amount,
        action,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const blockUser = createAsyncThunk(
  "user/block",
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${userId}/block`, { reason });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const unblockUser = createAsyncThunk(
  "user/unblock",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${userId}/unblock`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const banUser = createAsyncThunk(
  "user/ban",
  async ({ userId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${userId}/ban`, { reason });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const suspendUser = createAsyncThunk(
  "user/suspend",
  async ({ userId, reason, days }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${userId}/suspend`, {
        reason,
        days,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const bulkUserAction = createAsyncThunk(
  "user/bulkAction",
  async ({ userIds, action, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/bulk-action", {
        userIds,
        action,
        reason,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

/* ============================================================
   Slice
   ============================================================ */

const initialState = {
  users: [],
  selectedUser: null,
  selectedUserData: null,


dailyBonus: {
    canClaim: false,
    currentStars: 0,
    dailyReward: 3,
    streak: 0,
    totalClaims: 0,
    lastClaimAt: null,
    nextClaimAt: null,
    timeRemaining: 0,
  },


  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  stats: {
    total: 0,
    admins: 0,
    moderators: 0,
    users: 0,
    blocked: 0,
  },

  loading: false,
  detailsLoading: false,
  actionLoading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (s) => {
      s.error = null;
    },
    clearSuccess: (s) => {
      s.success = false;
    },
    clearSelectedUser: (s) => {
      s.selectedUser = null;
      s.selectedUserData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Fetch All ---------- */
      .addCase(fetchAllUsers.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.users = a.payload.users;
        s.pagination = a.payload.pagination;
        s.stats = a.payload.stats;
      })
      .addCase(fetchAllUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      /* ---------- Fetch Details ---------- */
      .addCase(fetchUserDetails.pending, (s) => {
        s.detailsLoading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (s, a) => {
        s.detailsLoading = false;
        s.selectedUserData = a.payload;
      })
      .addCase(fetchUserDetails.rejected, (s, a) => {
        s.detailsLoading = false;
        s.error = a.payload;
      })

      /* ---------- Update Role ---------- */
      .addCase(updateUserRole.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload._id);
        if (idx !== -1) s.users[idx] = a.payload;
        s.success = true;
      })

      /* ---------- Adjust Stars ---------- */
      .addCase(adjustUserStars.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload.user._id);
        if (idx !== -1) s.users[idx].stars = a.payload.user.stars;
        s.success = true;
      })

      /* ---------- Moderation Actions ---------- */
      .addCase(blockUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload.user._id);
        if (idx !== -1) s.users[idx].status = a.payload.user.status;
        s.success = true;
      })
      .addCase(unblockUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload.user._id);
        if (idx !== -1) s.users[idx].status = "active";
        s.success = true;
      })
      .addCase(banUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload.user._id);
        if (idx !== -1) s.users[idx].status = "banned";
        s.success = true;
      })
      .addCase(suspendUser.fulfilled, (s, a) => {
        const idx = s.users.findIndex((u) => u._id === a.payload.user._id);
        if (idx !== -1) s.users[idx].status = "suspended";
        s.success = true;
      })

      /* ---------- Delete ---------- */
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.users = s.users.filter((u) => u._id !== a.payload);
        s.success = true;
      })

      /* ---------- Bulk ---------- */
      .addCase(bulkUserAction.fulfilled, (s) => {
        s.success = true;
      })
      /* ---------- Daily Bonus Status ---------- */
.addCase(fetchDailyBonusStatus.pending, (s) => {
  s.dailyBonusLoading = true;
})
.addCase(fetchDailyBonusStatus.fulfilled, (s, a) => {
  s.dailyBonusLoading = false;
  s.dailyBonus = a.payload;
})
.addCase(fetchDailyBonusStatus.rejected, (s, a) => {
  s.dailyBonusLoading = false;
  s.error = a.payload;
})

/* ---------- Claim Daily Bonus ---------- */
.addCase(claimDailyBonus.pending, (s) => {
  s.claiming = true;
  s.error = null;
})
.addCase(claimDailyBonus.fulfilled, (s, a) => {
  s.claiming = false;
  s.success = true;
  s.dailyBonus.canClaim = false;
  s.dailyBonus.currentStars = a.payload.newBalance;
  s.dailyBonus.streak = a.payload.streak;
  s.dailyBonus.nextClaimAt = a.payload.nextClaimAt;
  s.dailyBonus.timeRemaining = 24 * 60 * 60; // reset countdown
})
.addCase(claimDailyBonus.rejected, (s, a) => {
  s.claiming = false;
  s.error = a.payload;
});
  },
});

export const { clearUserError, clearSuccess, clearSelectedUser } =
  userSlice.actions;
export default userSlice.reducer;