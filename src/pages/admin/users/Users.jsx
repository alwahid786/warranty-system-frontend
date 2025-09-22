import { useNavigate, useParams } from "react-router";
import AttendanceChart from "../../../components/admin/users/AttendanceChart";
import StatusOverviewCard from "../../../components/admin/users/OverviewStats";
// import OverviewStats from "../../../components/admin/users/OverviewStats";
import TotalUsersCard from "../../../components/admin/users/TotalUsersCard";
import UsersDetailCard from "../../../components/admin/users/UsersDetailCard";
import UsersFilterBar from "../../../components/admin/users/UsersFilterBar";
// import SummaryCard from "../../../components/admin/users/TotalUsersCard";
import UsersHeader from "../../../components/admin/users/UsersHeader";
import UsersPagination from "../../../components/admin/users/UsersPaginations";
import { useEffect, useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../../redux/apis/userApis";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedUser,
  setSelectedUser,
  setUserCount,
} from "../../../redux/slices/userSlice";
import EditUserModal from "../../../utils/EditUserModal";
import { useUpdateUserMutation } from "../../../redux/apis/userApis";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import toast from "react-hot-toast";
import { useGetUsersStatQuery } from "../../../redux/apis/userApis";

const Users = () => {
  const { userCount } = useSelector((state) => state.user);

  const [filters, setFilters] = useState({
    searchType: "id",
    searchValue: "",
    fromDate: "",
    toDate: "",
    selectedBrand: null,
    status: "",
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.user);

  const users = Array.isArray(selectedUser)
    ? selectedUser
    : selectedUser?.data ?? [];

  const {
    data,
    isSuccess,
    isError,
    isLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery(undefined, { refetchOnMountOrArgChange: true });

  const [deleteUser] = useDeleteUserMutation();

  const [updateUser] = useUpdateUserMutation();

  const { data: usersStats, refetch: getUsersStatRefetch } =
    useGetUsersStatQuery();

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
      JSON.stringify(id);
      const res = await deleteUser(id).unwrap();
      if (res.success) {
        toast.success(res.message || "User deleted", { duration: 3000 });
        await getUsersStatRefetch();
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

  const filteredData = currentUsers.filter((row) => {
    // Search
    if (filters.searchValue) {
      const val = filters.searchValue.toLowerCase();
      if (
        filters.searchType === "id" &&
        !row.id.toString().toLowerCase().includes(val)
      )
        return false;
      if (
        filters.searchType === "name" &&
        !row.name.toLowerCase().includes(val)
      )
        return false;
    }

    return true;
  });

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      navigate(`/users/${page}`);
    }
  };

  const userSummary = {
    total: selectedUser?.length,
    change: "+2.7% from last month",
    overview: [
      { label: "Active", value: userCount?.activeUsers, color: "green" },
      { label: "Inactive", value: userCount?.inactiveUsers, color: "red" },
    ],
  };

  const attendanceData = [
    {
      month: "Jan",
      Active: userCount?.activeUsers,
      Inactive: userCount?.inactiveUsers,
    },
    {
      month: "Feb",
      Active: userCount?.activeUsers,
      Inactive: userCount?.inactiveUsers,
    },
    {
      month: "Mar",
      Active: userCount?.activeUsers,
      Inactive: userCount?.inactiveUsers,
    },
    {
      month: "Apr",
      Active: userCount?.activeUsers,
      Inactive: userCount?.inactiveUsers,
    },
    {
      month: "May",
      Active: userCount?.activeUsers,
      Inactive: userCount?.inactiveUsers,
    },
    {
      month: "Jun",
      Active: userCount?.activeUsers,
      Inactive: userCount?.inactiveUsers,
    },
  ];

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      <UsersHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          <TotalUsersCard />
          {/* <TotalUsersCard /> */}
          <StatusOverviewCard stats={userSummary.overview} />
        </div>
        <AttendanceChart data={attendanceData} />
      </div>

      <div className="bg-white py-6 px-5 rounded-[10px] shadow-sm mt-5">
        <p className="font-inter font-medium text-[22px] text-dark-text">
          Users List
        </p>
        <UsersFilterBar filters={filters} onFilterChange={handleFilterChange} />
        <div className="mt-5 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((user) => (
              <UsersDetailCard
                user={user}
                key={user._id}
                onEdit={() => handleOnEdit(user)}
                onDelete={() => handleOnDeleteConfirmation(user._id)}
              />
            ))}
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
