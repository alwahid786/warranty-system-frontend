import React, { useState } from "react";
import AddUserModal from "./AddUserModal";
import { Phone } from "lucide-react";
import {
  useAddUserMutation,
  useGetTotalUsersCountQuery,
  useGetAttendanceChartDataQuery,
} from "../../../redux/apis/userApis";
import { useGetUsersStatQuery } from "../../../redux/apis/userApis";
import toast from "react-hot-toast";

const UsersHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setformData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const { data: usersStats, refetch: getUsersStatRefetch } =
    useGetUsersStatQuery();
  const [addUser, { isLoading }] = useAddUserMutation();

  const { refetch: getTotalUsersCountRefetch } = useGetTotalUsersCountQuery();

  const { refetch: getAttendanceChartDataRefetch } =
    useGetAttendanceChartDataQuery();

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await addUser(formData).unwrap();
      toast.success(res.message, { duration: 3000 });
      if (res.success) {
        setIsOpen(false);
        await getTotalUsersCountRefetch();
        await getAttendanceChartDataRefetch();
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
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">Users List</h1>
        <p className="text-sm text-gray-500">Manage all your Users</p>
      </div>

      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="py-2 bg-primary text-base text-white px-4 rounded-sm"
      >
        + Add New Users
      </button>

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
            type="text"
            value={formData.phone}
            onChange={(e) =>
              setformData({ ...formData, phone: e.target.value })
            }
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded"
          />
          <label>Password</label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) =>
              setformData({ ...formData, password: e.target.value })
            }
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded w-full"
          >
            Save
          </button>
        </form>
      </AddUserModal>
    </div>
  );
};

export default UsersHeader;
