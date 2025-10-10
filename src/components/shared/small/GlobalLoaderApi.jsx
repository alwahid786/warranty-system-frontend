import { useSelector } from "react-redux";

const NO_LOADER_ENDPOINTS = new Set([
  "login",
  "forgetPassword",
  "resetPassword",
  "getMyProfile",
  "getChat",
  "sendMessage",
  "getCompaniesAvgResponseTime",
  "getCompaniesAvgResponseTimeAll",
  "getClaims",
  "getArchieveClaims",
  "getInvoicesStat",
  "getClaimsStat",
  "getClients",
  "getActiveInactiveCount",
  "getClientsStat",
  "getClientsStatByFilters",
  "getClientsActivityStats",
  "getInvoices",
  "getArchieveInvoices",
  "getNotifications",
  "getUsers",
  "getUsersStat",
  "getTotalUsersCount",
  "getAttendanceChartData",
  "sendMessage",
]);

const GlobalAPILoader = () => {
  const pendingTasks = useSelector((state) => {
    let tasks = [];

    Object.values(state).forEach((slice) => {
      if (!slice?.queries && !slice?.mutations) return;

      // get the api instance from the store if available
      const apiInstance = Object.values(state).find(
        (s) => s?.reducerPath && s?.config
      );

      // process queries + mutations
      ["queries", "mutations"].forEach((type) => {
        const collection = slice?.[type];
        if (!collection) return;

        Object.entries(collection).forEach(([key, q]) => {
          if (q?.status === "pending") {
            const endpoint = key.split("(")[0];

            // Skip endpoints that should not show loader
            if (NO_LOADER_ENDPOINTS.has(endpoint)) return;

            tasks.push(apiMessages[endpoint] || `Processing ${endpoint}...`);
          }
        });
      });
    });

    return tasks;
  });

  if (pendingTasks.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-80">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-gray-700">In Progress</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalAPILoader;
