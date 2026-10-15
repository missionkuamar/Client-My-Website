import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import projectReducer from "../features/project/projectSlice";
import paymentReducer from "../features/payment/paymentSlice";  
import blogReducer from "../features/blog/blogSlice";
import notificationReducer from "../features/notification/notificationSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    project: projectReducer,
    payment: paymentReducer,   
    blog: blogReducer,
    notification: notificationReducer,
     analytics: analyticsReducer,
  },
});