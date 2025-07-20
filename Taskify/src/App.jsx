import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";

// Layouts
import Layout from "./components/Layout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import AuthSuccess from "./pages/auth/AuthSuccess";

// Task Pages
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/tasks/AllTasks";
import TodayTasks from "./pages/tasks/TodayTasks";
import UpcomingTasks from "./pages/tasks/UpcomingTasks";
import ImportantTasks from "./pages/tasks/ImportantTasks";
import CompletedTasks from "./pages/tasks/CompletedTasks";
import TaskDetail from "./pages/tasks/TaskDetail";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";

// User Pages
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

// Other Pages
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const { user, loading, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth Routes - Accessible only when not logged in */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/reset-password/:token"
          element={
            loading ? (
              <LoadingScreen />
            ) : !user ? (
              <ResetPassword />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* Protected Routes - Require authentication */}
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />

          {/* Task Routes */}
          <Route path="/tasks" element={<AllTasks />} />
          <Route path="/tasks/today" element={<TodayTasks />} />
          <Route path="/tasks/upcoming" element={<UpcomingTasks />} />
          <Route path="/tasks/important" element={<ImportantTasks />} />
          <Route path="/tasks/completed" element={<CompletedTasks />} />
          <Route path="/tasks/new" element={<CreateTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />

          {/* User Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
