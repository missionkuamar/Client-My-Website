import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ============================================
// Register Thunk
// ============================================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);


// Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/auth/profile", userData);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

// Change Password Thunk
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/auth/change-password", passwords);
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);


// Google Login / Register
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/google", { credential });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Google login failed"
      );
    }
  }
);
// ============================================
// Login Thunk
// ============================================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
     // console.log("Login successful:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// ============================================
// Initial State
// ============================================
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// ============================================
// Slice
// ============================================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateStars: (state, action) => {
      if (state.user) {
        state.user.stars = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- Login ----------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------- Register ----------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
.addCase(updateProfile.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload;
})
.addCase(updateProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

// Change Password
.addCase(changePassword.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(changePassword.fulfilled, (state) => {
  state.loading = false;
})
.addCase(changePassword.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
.addCase(googleLogin.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(googleLogin.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
})
.addCase(googleLogin.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  /* ---------- Fetch Me ---------- */
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })

     

  },
});

export const { logout, updateStars, updateUser } = authSlice.actions;
export default authSlice.reducer;