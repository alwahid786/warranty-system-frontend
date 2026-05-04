import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AttendanceChart from "../../../components/admin/users/AttendanceChart";
import StatusOverviewCard from "../../../components/admin/users/OverviewStats";
// import OverviewStats from "../../../components/admin/users/OverviewStats";
import TotalUsersCard from "../../../components/admin/users/TotalUsersCard";
import UsersDetailCard from "../../../components/admin/users/UsersDetailCard";
import UsersFilterBar from "../../../components/admin/users/UsersFilterBar";
// import SummaryCard from "../../../components/admin/users/TotalUsersCard";
import UsersHeader from "../../../components/admin/users/UsersHeader";
import UsersPagination from "../../../components/admin/users/UsersPaginations";
import {
  useDeleteUserMutation,
  useGetUsersQuery
} from "../../../redux/apis/userApis";
import {
  clearSelectedUser,
  setSelectedUser,
  setUserCount
} from "../../../redux/slices/userSlice";
import EditUserModal from "../../../utils/EditUserModal";
import { useUpdateUserMutation } from "../../../redux/apis/userApis";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import {
  useGetTotalUsersCountQuery,
  useGetAttendanceChartDataQuery
} from "../../../redux/apis/userApis";
import { isDateInRange, matchesSearch } from "../../../utils/filterUtils";

const Users = () => {
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    searchType: "name",
    searchValue: "",
    fromDate: "",
    toDate: "",
    status: ""
  });

  const [selectedFilter, setSelectedFilter] = useState("This Month");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.user);

  const userQueryParams =
    user?.role === "admin" || user?.role === "superadmin"
      ? { onlyAdminSubusers: true }
      : undefined;

  const users = Array.isArray(selectedUser)
    ? selectedUser
    : (selectedUser?.data ?? []);

  const { data, isSuccess, isError } = useGetUsersQuery(userQueryParams, {
    refetchOnMountOrArgChange: true
  });

  const [deleteUser] = useDeleteUserMutation();

  const [updateUser] = useUpdateUserMutation();

  const { data: totalUsersCount, refetch: getTotalUsersCountRefetch } =
    useGetTotalUsersCountQuery(userQueryParams, {
      refetchOnMountOrArgChange: true
    });

  const { data: attendanceChartData, refetch: getAttendanceChartDataRefetch } =
    useGetAttendanceChartDataQuery(userQueryParams, {
      refetchOnMountOrArgChange: true
    });

  useEffect(() => {
    if (isSuccess && data?.success) {
      dispatch(setSelectedUser(data?.data));
      dispatch(setUserCount(data?.userCount));
    } else if (isError) {
      dispatch(clearSelectedUser());
    }
  }, [data, isSuccess, isError, dispatch]);

  const handleOnDeleteConfirmation = (id) => {
    setIsDeleteOpen(true);
    setDeleteId(id);
  };

  const handleOnDelete = async (id) => {
    try {
      const res = await deleteUser(id).unwrap();

      if (res.success) {
        toast.success(res.message || "User deleted", { duration: 3000 });
        await getTotalUsersCountRefetch();
        await getAttendanceChartDataRefetch();
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleOnEdit = (user) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleSaveUser = async (updatedData) => {
    try {
      const res = await updateUser({ id: editingUser._id, ...updatedData });

      toast.success(res?.message || "User updated", { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }

    setIsEditOpen(false);
    setEditingUser(null);
  };

  const { pageId } = useParams();
  const navigate = useNavigate();

  const currentPage = parseInt(pageId) || 1;
  const usersPerPage = 8;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  // Filters --------->
  const filteredData = currentUsers.filter((row) => {
    // Search filter
    if (!matchesSearch(row, filters.searchValue, filters.searchType)) {
      return false;
    }

    // Date range filter
    if (!isDateInRange(row.createdAt, filters.fromDate, filters.toDate)) {
      return false;
    }

    return true;
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () =>
    setFilters({
      searchType: "id",
      searchValue: "",
      fromDate: "",
      toDate: "",
      status: ""
    });

  const canManageUser = (managedUser) => {
    return managedUser?.canManage === true;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      navigate(`/dashboard/users/${page}`);
    }
  };

  // Unused userSummary removed to fix linting error
  /*
  const userSummary = {
    total: selectedUser?.length,
    change: "+2.7% from last month",
    overview: [
      { label: "Active", value: userCount?.activeUsers, color: "green" },
      { label: "Inactive", value: userCount?.inactiveUsers, color: "red" },
    ],
  };
  */

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      <UsersHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          <TotalUsersCard
            stats={totalUsersCount?.data}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
          <StatusOverviewCard
            active={
              totalUsersCount?.data?.[
                selectedFilter === "This Week"
                  ? "thisWeek"
                  : selectedFilter === "This Month"
                    ? "thisMonth"
                    : selectedFilter === "This Year"
                      ? "thisYear"
                      : "today"
              ]?.active
            }
            inactive={
              totalUsersCount?.data?.[
                selectedFilter === "This Week"
                  ? "thisWeek"
                  : selectedFilter === "This Month"
                    ? "thisMonth"
                    : selectedFilter === "This Year"
                      ? "thisYear"
                      : "today"
              ]?.inactive
            }
          />
        </div>
        <AttendanceChart data={attendanceChartData?.data} />
      </div>

      <div className="bg-white py-6 px-5 rounded-[10px] shadow-sm mt-5">
        <p className="font-inter font-medium text-[22px] text-dark-text">
          Users List
        </p>
        <UsersFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <div className="mt-5 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <UsersDetailCard
                  user={user}
                  key={user._id}
                  canManage={canManageUser(user)}
                  onEdit={() => handleOnEdit(user)}
                  onDelete={() => handleOnDeleteConfirmation(user._id)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No users found
                </h3>
                <p className="text-gray-500 text-center max-w-xs">
                  Try adjusting your filters or search terms to find what you
                  are looking for.
                </p>
              </div>
            )}
          </div>

          <UsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <EditUserModal
        user={editingUser}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveUser}
      />
      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSave={handleOnDelete}
        id={deleteId}
        data={"Are you sure you want to delete this user?"}
      />
    </div>
  );
};

export default Users;
