import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Loader from "./components/shared/small/Loader";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/slices/authSlice";
import { useGetMyProfileQuery } from "./redux/apis/authApis";
import ProtectedRoute from "./components/ProtectedRoutes";

const AdminDashboard = lazy(() => import("./pages/admin/index"));
const Dashboard = lazy(() => import("./pages/admin/dashboard/Dashboard"));
const Actions = lazy(() => import("./pages/admin/actions/Actions"));
const Invoices = lazy(() => import("./pages/admin/invoices/Invoices"));
const Notification = lazy(() =>
  import("./pages/admin/notification/Notification")
);
const Users = lazy(() => import("./pages/admin/users/Users"));
const Archieved = lazy(() => import("./pages/admin/archieved/Archieved"));
const ArchievedActions = lazy(() =>
  import("./pages/admin/archieved/actions.archieved")
);
const ArchievedInvoices = lazy(() =>
  import("./pages/admin/archieved/Invoices.Archieved")
);
const Settings = lazy(() => import("./pages/admin/settings/Settings"));
const AdminLogin = lazy(() => import("./pages/admin/adminLogin/AdminLogin"));
const AdminResetPassword = lazy(() =>
  import("./pages/admin/adminLogin/AdminResetPassword")
);
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { data, isSuccess, isError, isLoading } = useGetMyProfileQuery();

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(userExist(data?.data));
    } else if (isError) {
      dispatch(userNotExist());
    }
  }, [data, isSuccess, isError, dispatch]);

  if (isLoading) return <Loader />;

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <ProtectedRoute user={!user} redirect="/">
                <AdminLogin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password/:token"
            element={<AdminResetPassword />}
          />

          {/* Protected Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute user={user} redirect="/login">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="actions" element={<Actions />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="notification" element={<Notification />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:pageId" element={<Users />} />
            <Route path="archieved" element={<Archieved />} />
            <Route path="archieved/actions" element={<ArchievedActions />} />
            <Route path="archieved/invoices" element={<ArchievedInvoices />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
