import React, { useState } from "react";
import AddUserModal from "./AddUserModal";
import { Eye, EyeOff } from "lucide-react";
import {
  useAddUserMutation,
  useGetTotalUsersCountQuery,
  useGetAttendanceChartDataQuery,
  useGetUsersStatQuery,
} from "../../../redux/apis/userApis";
import toast from "react-hot-toast";

const UsersHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setformData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const { refetch: getUsersStatRefetch } = useGetUsersStatQuery({ onlyAdminSubusers: true });
  const [addUser, { isLoading }] = useAddUserMutation();

  const { refetch: getTotalUsersCountRefetch } = useGetTotalUsersCountQuery({ onlyAdminSubusers: true });

  const { refetch: getAttendanceChartDataRefetch } =
    useGetAttendanceChartDataQuery({ onlyAdminSubusers: true });

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await addUser(formData).unwrap();
      toast.success(res.message, { duration: 3000 });
      if (res.success) {
        setIsOpen(false);
        await getTotalUsersCountRefetch();
        await getAttendanceChartDataRefetch();
        await getUsersStatRefetch();
        setformData({
          name: "",
          email: "",
          phone: "",
          password: "",
        });
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex w-full flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Users List</h1>
          <p className="text-sm text-gray-500">Manage all your Users</p>
        </div>

        {/* Button to open modal */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-sm bg-primary px-4 py-2 text-base text-white sm:w-auto"
        >
          + Add New Users
        </button>
      </div>

      {/* Modal */}
      <AddUserModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form className="space-y-4" onSubmit={handleAddUser}>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setformData({ ...formData, name: e.target.value })}
            placeholder="First Name"
            className="w-full border px-3 py-2 rounded"
          />
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setformData({ ...formData, email: e.target.value })
            }
            placeholder="Email Address"
            className="w-full border px-3 py-2 rounded"
          />
          <label>Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              const isPlus = value.startsWith("+");
              const digits = value.replace(/\D/g, "");
              const finalValue = (isPlus ? "+" : "") + digits.slice(0, 11);
              setformData({ ...formData, phone: finalValue });
            }}
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded"
          />
          <label>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setformData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-dark-text"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-primary text-white px-4 py-2 rounded w-full transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-dark"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </AddUserModal>
    </div>
  );
};

export default UsersHeader;
