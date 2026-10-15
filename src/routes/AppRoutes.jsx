import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

// Public pages
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

// Layouts
import AdminLayout from "../components/admin/AdminLayout";
import UserLayout from "../components/user/UserLayout";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import AdminProjects from "../pages/admin/Projects";
import UploadProject from "../pages/admin/UploadProject";
import Analytics from "../pages/admin/Analytics";
import Blogs from "../pages/admin/Blogs";
import CreateBlog from "../pages/admin/CreateBlog";

// User pages
import UserDashboard from "../pages/user/Dashboard";
import Projects from "../pages/user/Projects";
import ProjectDetail from "../pages/user/ProjectDetail";
import Stars from "../pages/user/Stars";
import MyPurchases from "../pages/user/MyPurchases";
import Wallet from "../pages/user/Wallet";
import Notifications from "../pages/user/Notifications";
import Settings from "../pages/user/Settings";
import BlogDetail from "../pages/user/BlogDetail";
import BlogsPublic from "../pages/user/BlogsPublic";   // ⬅️ ADD

import {
  AboutUs,
  ContactUs,
  Support,
  PrivacyPolicy,
  TermsOfService,
  RefundPolicy,
  Licensing,
} from "../pages/InfoPages";


const AppRoutes = () => {
  return (
    <Routes>
      {/* ============ PUBLIC ROUTES ============ */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
<Route path="/blog" element={<BlogsPublic />} />   {/* list page — future */}
<Route path="/blog/:slug" element={<BlogDetail />} />






<Route path="/about" element={<AboutUs />} />
<Route path="/contact" element={<ContactUs />} />
<Route path="/support" element={<Support />} />
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms" element={<TermsOfService />} />
<Route path="/refund-policy" element={<RefundPolicy />} />
<Route path="/licensing" element={<Licensing />} />



      {/* ============ ADMIN ROUTES ============ */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/upload" element={<UploadProject />} />
          <Route path="/admin/blogs" element={<Blogs />} />
          <Route path="/admin/create-blog" element={<CreateBlog />} />
          
        </Route>
      </Route>

      {/* ============ USER ROUTES ============ */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["user", "admin", "moderator"]} />
        }
      >
        <Route element={<UserLayout />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/purchases" element={<MyPurchases />} />
          <Route path="/user/wallet" element={<Wallet />} />
          <Route path="/user/notifications" element={<Notifications />} />
          <Route path="/user/settings" element={<Settings />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/stars" element={<Stars />} />
        </Route>
      </Route>

      {/* ============ 404 ============ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;