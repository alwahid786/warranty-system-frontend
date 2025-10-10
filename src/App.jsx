import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import Loader from "./components/shared/small/Loader";
import GlobalAPILoader from "./components/shared/small/GlobalLoaderApi";
import { useGetMyProfileQuery } from "./redux/apis/authApis";
import { useGetNotificationsQuery } from "./redux/apis/notificationsApis";
import { userExist, userNotExist } from "./redux/slices/authSlice";
import {
  noUnReadNotifications,
  unReadNotifications,
  setNotifications,
  addNotification,
} from "./redux/slices/notificationsSlice";
import { SOCKET } from "./utils/socket";
import toast from "react-hot-toast";

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
const Clients = lazy(() => import("./pages/admin/clients/Clients"));
const AdminLogin = lazy(() => import("./pages/admin/adminLogin/AdminLogin"));
const AdminResetPassword = lazy(() =>
  import("./pages/admin/adminLogin/AdminResetPassword")
);
const CompaniesResponseTime = lazy(() =>
  import("./pages/admin/Companies-Avg-Response/companies-response-time")
);
const LandingPage = lazy(() => import("./pages/public/landing/Landing"));
const BecomeMember = lazy(() =>
  import("./pages/public/become-member/Become-Member")
);
const DonateUs = lazy(() => import("./pages/public/donate-us/Donate-us"));
const TermsAndConditions = lazy(() =>
  import("./pages/public/terms-and-policy/termsAndConditions")
);
const PrivacyPolicy = lazy(() =>
  import("./pages/public/terms-and-policy/Privacy-Policy")
);
const ThankYouPage = lazy(() =>
  import("./pages/public/terms-and-policy/thank-you")
);
const DonateUsDashboard = lazy(() =>
  import("./pages/admin/donate-us/Donate-Us")
);

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data, isSuccess, isError, isLoading } = useGetMyProfileQuery();
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !isSuccess,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(userExist(data?.data));

      if (notifications?.data?.length > 0) {
        dispatch(unReadNotifications(notifications?.unReadCount));
        dispatch(setNotifications(notifications?.data));
      } else {
        dispatch(noUnReadNotifications());
      }
    } else if (isError) {
      dispatch(userNotExist());
      dispatch(noUnReadNotifications());
    }
  }, [data, isSuccess, isError, notifications, dispatch]);

  useEffect(() => {
    if (!user?._id) return;
    SOCKET.auth = { userId: user?._id };
    SOCKET.connect();
    const handleNotification = (data) => {
      toast.success(data?.message || "New Notification", { duration: 5000 });
      dispatch(addNotification(data));
    };

    SOCKET.on("connect", () => {
      console.log("Connected to server with userId:", user._id);
    });

    SOCKET.on("notification:insert", handleNotification);

    return () => {
      SOCKET.off("notification:insert", handleNotification);
      SOCKET.off("connect");
      SOCKET.disconnect();
    };
  }, [user?._id, dispatch]);

  if (!user && isLoading) return <Loader />;

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/*  Public Routes */}
            <Route
              path="/"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/dashboard/actions" replace />
                  )
                ) : (
                  <LandingPage />
                )
              }
            />

            <Route
              path="/login"
              element={
                <ProtectedRoute user={!user} redirect="/dashboard">
                  <AdminLogin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reset-password/:token"
              element={<AdminResetPassword />}
            />

            {/* Protected Admin Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user} redirect="/">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              {/*  Nested Pages */}
              <Route index element={<Dashboard />} />
              <Route path="actions" element={<Actions />} />
              <Route
                path="invoices"
                element={
                  <ProtectedRoute
                    user={user}
                    redirect="/"
                    allowedRoles={["admin"]}
                  >
                    <Invoices />
                  </ProtectedRoute>
                }
              />
              <Route path="notification" element={<Notification />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:pageId" element={<Users />} />
              <Route
                path="archieved"
                element={
                  <ProtectedRoute
                    user={user}
                    redirect="/"
                    allowedRoles={["admin"]}
                  >
                    <Archieved />
                  </ProtectedRoute>
                }
              />
              <Route
                path="archieved/actions"
                element={
                  <ProtectedRoute
                    user={user}
                    redirect="/"
                    allowedRoles={["admin"]}
                  >
                    <ArchievedActions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="archieved/invoices"
                element={
                  <ProtectedRoute
                    user={user}
                    redirect="/"
                    allowedRoles={["admin"]}
                  >
                    <ArchievedInvoices />
                  </ProtectedRoute>
                }
              />
              <Route path="settings" element={<Settings />} />
              <Route
                path="companies-response-time"
                element={
                  <ProtectedRoute
                    user={user}
                    redirect="/"
                    allowedRoles={["admin"]}
                  >
                    <CompaniesResponseTime />
                  </ProtectedRoute>
                }
              />
              <Route
                path="clients"
                element={
                  <ProtectedRoute
                    user={user}
                    redirect="/"
                    allowedRoles={["admin"]}
                  >
                    <Clients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="donate-us"
                element={
                  <ProtectedRoute
                    user={user}
                    redirect="/"
                    allowedRoles={["admin"]}
                  >
                    <DonateUsDashboard />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/*public pages */}
            <Route path="/become-member" element={<BecomeMember />} />
            <Route path="/donate-us" element={<DonateUs />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <GlobalAPILoader />
    </>
  );
}

export default App;
