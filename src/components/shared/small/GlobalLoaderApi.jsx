import { useSelector } from "react-redux";

const apiMessages = {
  login: "Logging in...",
  register: "Registering account...",
  getMyProfile: "Fetching profile...",
  updateMyProfile: "Updating profile...",
  forgetPassword: "Sending reset link...",
  resetPassword: "Resetting password...",
  getChat: "Fetching chat...",
  sendMessage: "Sending message...",
  getCompaniesAvgResponseTime: "Fetching companies avg response time...",
  getCompaniesAvgResponseTimeAll: "Fetching companies avg response time all...",
  getClaims: "Fetching claims...",
  addClaims: "Adding claims...",
  exportClaims: "Exporting claims...",
  updateClaim: "Updating claim...",
  updateClaimsAdditionalData: "Updating claim additional data...",
  deleteClaim: "Deleting claim...",
  getArchieveClaims: "Fetching archieve claims...",
  addArchieveClaims: "Adding archieve claims...",
  removeArchieveClaims: "Removing archieve claims...",
  getInvoicesStat: "Fetching invoices stat...",
  getClaimsStat: "Fetching claims stat...",
  getClients: "Fetching clients...",
  getClientsById: "Fetching clients by id...",
  addClient: "Adding client...",
  updateClient: "Updating client...",
  deleteClient: "Deleting client...",
  getActiveInactiveCount: "Fetching active/inactive count...",
  getClientsStat: "Fetching clients stat...",
  getClientsStatByFilters: "Fetching clients stat by filters...",
  getClientsActivityStats: "Fetching clients activity stats...",
  getInvoices: "Fetching invoices...",
  getInvoicesById: "Fetching invoices by id...",
  addInvoice: "Adding invoice...",
  updateInvoice: "Updating invoice...",
  changeInvoiceStatus: "Updating invoice status...",
  deleteInvoice: "Deleting invoice...",
  sendInvoice: "Sending invoice PDF...",
  addArchieveInvoices: "Adding archieve invoices...",
  getArchieveInvoices: "Fetching archieve invoices...",
  removeArchieveInvoices: "Removing archieve invoices...",
  getNotifications: "Fetching notifications...",
  deleteNotification: "Deleting notification...",
  readNotification: "Reading notification...",
  readAllNotifications: "Marking all notifications as read...",
  getUsers: "Fetching users...",
  getUserById: "Fetching user by id...",
  addUser: "Adding user...",
  updateUser: "Updating user...",
  deleteUser: "Deleting user...",
  getUsersStat: "Fetching users stat...",
  getTotalUsersCount: "Fetching total users count...",
  getAttendanceChartData: "Fetching attendance chart data...",
};

// Keep this list small: only skip endpoints where a global loader would be disruptive.
const SKIP_GLOBAL_LOADER_ENDPOINTS = new Set(["sendMessage"]);

const GlobalAPILoader = () => {
  const { blockingTasks, nonBlockingTasks } = useSelector((state) => {
    const blocking = [];
    const nonBlocking = [];

    Object.values(state).forEach((slice) => {
      if (!slice?.queries && !slice?.mutations) return;

      // process queries + mutations
      ["queries", "mutations"].forEach((type) => {
        const collection = slice?.[type];
        if (!collection) return;

        Object.entries(collection).forEach(([key, q]) => {
          if (q?.status === "pending") {
            const endpoint = key.split("(")[0];

            if (SKIP_GLOBAL_LOADER_ENDPOINTS.has(endpoint)) return;

            const message =
              apiMessages[endpoint] || `Processing ${endpoint}...`;

            // Mutations are always blocking. Queries block only on first load.
            if (type === "mutations") {
              blocking.push(message);
              return;
            }

            const isFirstLoad =
              q?.fulfilledTimeStamp == null && q?.data == null;

            if (isFirstLoad) blocking.push(message);
            else nonBlocking.push(message);
          }
        });
      });
    });

    return {
      blockingTasks: Array.from(new Set(blocking)),
      nonBlockingTasks: Array.from(new Set(nonBlocking)),
    };
  });

  const primaryMessage =
    blockingTasks[0] || nonBlockingTasks[0] || "Loading...";
  const extraCount =
    (blockingTasks.length > 0 ? blockingTasks.length : nonBlockingTasks.length) -
    1;

  if (blockingTasks.length === 0 && nonBlockingTasks.length === 0) return null;

  return (
    <>
      {nonBlockingTasks.length > 0 && blockingTasks.length === 0 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-[1100px] px-4 pt-3">
            <div className="flex items-center gap-3 rounded-lg bg-white/95 shadow px-4 py-3">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-700">{primaryMessage}</span>
              {extraCount > 0 && (
                <span className="text-xs text-gray-500">
                  +{extraCount} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {blockingTasks.length > 0 && (
        <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-96">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">
                  Please wait
                </span>
                <span className="text-sm text-gray-600">{primaryMessage}</span>
                {extraCount > 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    +{extraCount} more task(s)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalAPILoader;
