import React, { useState } from "react";

import { useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";
import AddUserModal from "./AddUserModal";
import {
  useAddUserMutation,
  useGetTotalUsersCountQuery,
  useGetAttendanceChartDataQuery,
  useGetUsersStatQuery
} from "../../../redux/apis/userApis";

const UsersHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setformData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    gender: ""
  });

  const userQueryParams =
    user?.role === "admin" || user?.role === "superadmin"
      ? { onlyAdminSubusers: true }
      : undefined;

  const { refetch: getUsersStatRefetch } =
    useGetUsersStatQuery(userQueryParams);

  const [addUser, { isLoading }] = useAddUserMutation();

  const { refetch: getTotalUsersCountRefetch } =
    useGetTotalUsersCountQuery(userQueryParams);

  const { refetch: getAttendanceChartDataRefetch } =
    useGetAttendanceChartDataQuery(userQueryParams);

  const resetForm = () => {
    setformData({
      name: "",
      email: "",
      phone: "",
      password: "",
      gender: ""
    });
    setShowPassword(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await addUser(formData).unwrap();

      toast.success(res.message, { duration: 3000 });
      if (res.success) {
        handleClose();
        await getTotalUsersCountRefetch();
        await getAttendanceChartDataRefetch();
        await getUsersStatRefetch();
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
      <AddUserModal isOpen={isOpen} onClose={handleClose}>
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form className="space-y-4" onSubmit={handleAddUser} autoComplete="off">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setformData({ ...formData, name: e.target.value })}
            placeholder="First Name"
            className="w-full border px-3 py-2 rounded"
            required
            autoComplete="off"
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
            required
            autoComplete="off"
          />
          <label>Phone</label>
          <PhoneInput
            country={"pk"}
            value={formData.phone}
            onChange={(value) => setformData({ ...formData, phone: value })}
            inputClass="!outline-none !border !border-[#e5e5e5] !h-[50px] !rounded-md !w-full !text-sm !text-[#535353] !bg-white"
            containerClass="!w-full"
          />
          <label>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setformData({ ...formData, gender: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

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
              required
              autoComplete="new-password"
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
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary-dark"
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
