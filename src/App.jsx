import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import Loader from "./components/shared/small/Loader";
import GlobalAPILoader from "./components/shared/small/GlobalLoaderApi";
import { useGetMyProfileQuery } from "./redux/apis/authApis";
import claimsApis from "./redux/apis/claimsApis";
import chatApis from "./redux/apis/chatApis";
import notificationsApis, {
  useGetNotificationsQuery,
} from "./redux/apis/notificationsApis";
import { userExist, userNotExist } from "./redux/slices/authSlice";
import {
  noUnReadNotifications,
  unReadNotifications,
  setNotifications,
  addNotification,
} from "./redux/slices/notificationsSlice";
import { SOCKET } from "./utils/socket";
import toast from "react-hot-toast";
import TermsModal from "./components/shared/TermsModal";

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
    refetchOnMountOrArgChange: false,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 15000,
  });

  useEffect(() => {
    if (!isSuccess || !data?.data) return;
    // Only set the user from the profile query if the store doesn't already
    // contain a user, or if the returned profile is different from the
    // currently stored user.
    if (
      !user?._id ||
      data?.data._id !== user?._id ||
      data?.data.termsAccepted !== user?.termsAccepted ||
      data?.data.activeStatus !== user?.activeStatus
    ) {
      dispatch(userExist(data?.data));
    }

    dispatch(setNotifications(notifications?.data || []));
    if ((notifications?.unReadCount || 0) > 0) {
      dispatch(unReadNotifications(notifications?.unReadCount || 0));
    } else {
      dispatch(noUnReadNotifications());
    }
  }, [
    isSuccess,
    data?.data,
    notifications?.data,
    user?._id,
    user?.activeStatus,
    user?.termsAccepted,
    notifications?.unReadCount,
    dispatch,
  ]);

  useEffect(() => {
    if (isError) {
      dispatch(userNotExist());
      dispatch(noUnReadNotifications());
    }
  }, [dispatch, isError]);

  useEffect(() => {
    if (!user?._id) return;
    SOCKET.auth = {
      userId: user?._id,
      ownerId: user?.owner?._id || user?.owner,
    };
    SOCKET.connect();

    const handleNotification = (data) => {
      const toastId = data?._id || "notification-update";
      toast.success(data?.message || "New Notification", {
        id: toastId,
        duration: 5000,
      });
      dispatch(addNotification(data));
      if (data?.claimId) {
        dispatch(claimsApis.util.invalidateTags(["Claims"]));
        dispatch(chatApis.util.invalidateTags(["chat"]));
      }
      dispatch(notificationsApis.util.invalidateTags(["notifications"]));
    };

    const handleChatMessage = () => {
      dispatch(claimsApis.util.invalidateTags(["Claims"]));
      dispatch(chatApis.util.invalidateTags(["chat"]));
    };

    SOCKET.on("connect", () => {
      console.log("Connected to server with userId:", user._id);
    });

    SOCKET.off("notification:insert");
    SOCKET.on("notification:insert", handleNotification);
    SOCKET.off("chat:message");
    SOCKET.on("chat:message", handleChatMessage);

    return () => {
      SOCKET.off("notification:insert", handleNotification);
      SOCKET.off("chat:message", handleChatMessage);
      SOCKET.off("connect");
      SOCKET.disconnect();
    };
  }, [user?._id, user?.owner, dispatch]);

  if (isLoading) return <Loader />;

  const showTermsModal =
    ['client', 'user'].includes(user?.role) && !user?.termsAccepted;

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        {showTermsModal && <TermsModal onAccept={() => {}} />}
        <Suspense fallback={<Loader />}>
          <Routes>
            {/*  Public Routes */}
            {/* <Route
              path="/"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="dashboard" replace />
                  ) : (
                    <Navigate to="/dashboard/actions" replace />
                  )
                ) : (
                  <LandingPage />
                )
              }
            /> */}

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
                  <AdminLogin />
                )
              }
            />

            {/* <Route
              path="/login"
              element={
                <ProtectedRoute user={!user} redirect="/dashboard">
                  <AdminLogin />
                </ProtectedRoute>
              }
            /> */}

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
                path="clients/:pageId"
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
              {/* <Route
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
              /> */}
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
        <GlobalAPILoader />
      </BrowserRouter>
    </>
  );
}

export default App;
