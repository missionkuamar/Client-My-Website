import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ============ Thunks ============

export const fetchPlans = createAsyncThunk(
  "payment/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/payments/plans");
      return data.plans;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load plans");
    }
  }
);

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (planId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/payments/create-order", { planId });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create order");
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/payments/verify", paymentData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Verification failed");
    }
  }
);

export const fetchMyPayments = createAsyncThunk(
  "payment/myPayments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        search = "",
        plan = "all",
        sortBy = "newest",
        page = 1,
        limit = 10,
      } = params;

      const query = new URLSearchParams({
        search,
        plan,
        sortBy,
        page: String(page),
        limit: String(limit),
      }).toString();

      const { data } = await api.get(`/payments/my-payments?${query}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// ============ Slice ============

const initialState = {
  plans: [],
  payments: [],

  // Pagination
  paymentsPagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  paymentsStats: {
    totalSpent: 0,
    totalStars: 0,
    transactions: 0,
  },

  loading: false,
  processing: false,
  error: null,
  successMessage: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.fulfilled, (s, a) => {
        s.plans = a.payload;
      })
      .addCase(createOrder.pending, (s) => {
        s.processing = true;
        s.error = null;
      })
      .addCase(createOrder.fulfilled, (s) => {
        s.processing = false;
      })
      .addCase(createOrder.rejected, (s, a) => {
        s.processing = false;
        s.error = a.payload;
      })
      .addCase(verifyPayment.pending, (s) => {
        s.processing = true;
      })
      .addCase(verifyPayment.fulfilled, (s, a) => {
        s.processing = false;
        s.successMessage = a.payload.message;
      })
      .addCase(verifyPayment.rejected, (s, a) => {
        s.processing = false;
        s.error = a.payload;
      })
      .addCase(fetchMyPayments.pending, (s) => {
  s.loading = true;
  s.error = null;
})
.addCase(fetchMyPayments.fulfilled, (s, a) => {
  s.loading = false;
  s.payments = a.payload.payments;
  s.paymentsPagination = a.payload.pagination;
  s.paymentsStats = a.payload.stats;
})
.addCase(fetchMyPayments.rejected, (s, a) => {
  s.loading = false;
  s.error = a.payload;
})
  },
});

export const { clearPaymentError, clearSuccessMessage } = paymentSlice.actions;
export default paymentSlice.reducer;