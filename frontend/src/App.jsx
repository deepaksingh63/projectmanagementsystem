import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage.jsx";
import UserDashboardPage from "./pages/dashboard/UserDashboardPage.jsx";
import ProjectsPage from "./pages/projects/ProjectsPage.jsx";
import TasksPage from "./pages/tasks/TasksPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

const App = () => {
  const { user } = useAuth();
  const homeRoute = user?.role === "admin" ? "/admin-dashboard" : "/dashboard";

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={homeRoute} replace />} />
        <Route path="dashboard" element={user?.role === "admin" ? <Navigate to="/admin-dashboard" replace /> : <UserDashboardPage />} />
        <Route path="admin-dashboard" element={user?.role === "admin" ? <AdminDashboardPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to={user ? homeRoute : "/login"} replace />} />
    </Routes>
  );
};

export default App;
