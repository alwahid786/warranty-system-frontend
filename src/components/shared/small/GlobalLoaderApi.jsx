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
  getUsers: "Fetching users...",
  getUserById: "Fetching user by id...",
  addUser: "Adding user...",
  updateUser: "Updating user...",
  deleteUser: "Deleting user...",
  getUsersStat: "Fetching users stat...",
  getTotalUsersCount: "Fetching total users count...",
  getAttendanceChartData: "Fetching attendance chart data...",
};

const GlobalAPILoader = () => {
  const pendingTasks = useSelector((state) => {
    let tasks = [];

    Object.values(state).forEach((slice) => {
      if (slice?.queries) {
        Object.entries(slice.queries).forEach(([key, q]) => {
          if (q?.status === "pending") {
            const endpoint = key.split("(")[0]; // get name before arguments
            tasks.push(apiMessages[endpoint] || `Loading ${endpoint}...`);
          }
        });
      }
      if (slice?.mutations) {
        Object.entries(slice.mutations).forEach(([key, q]) => {
          if (q?.status === "pending") {
            const endpoint = key.split("(")[0];
            tasks.push(apiMessages[endpoint] || `Processing ${endpoint}...`);
          }
        });
      }
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
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          {pendingTasks.map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GlobalAPILoader;
