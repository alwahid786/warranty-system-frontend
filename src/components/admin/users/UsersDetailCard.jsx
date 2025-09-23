import { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { HiPencil, HiTrash } from "react-icons/hi2";

const UsersDetailCard = ({ user, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 relative hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          {user?.image ? (
            <img
              src={user?.image}
              alt="User"
              className="w-14 h-14 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <FaUserCircle className="text-gray-400 text-3xl" />
            </div>
          )}

          {/* User Info */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-base">
                {user?.name}
              </p>
              {/* Status Badge */}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  user?.activeStatus
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.activeStatus ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-gray-500 text-xs">ID #{user?._id}</p>
          </div>
        </div>

        {/* 3-dot menu */}
        <div ref={menuRef} className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg
              width="16"
              height="4"
              viewBox="0 0 16 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="4" height="4" rx="2" fill="#1A1A1A" />
              <rect x="6" width="4" height="4" rx="2" fill="#1A1A1A" />
              <rect x="12" width="4" height="4" rx="2" fill="#1A1A1A" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(user);
                }}
                className="flex items-center font-bold gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
              >
                <HiPencil className="text-gray-600" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(user?._id);
                }}
                className="flex items-center font-bold gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
              >
                <HiTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="bg-gray-100 p-4 rounded-xl mt-5 text-sm space-y-3">
        <div className="flex justify-between">
          <div>
            <p className="font-semibold text-gray-800">Claims Rate</p>
            <p className="text-xs text-gray-600">{user?.claimsRate}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-800">Joining Date</p>
            <p className="text-xs text-gray-600">
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MdEmail className="text-gray-500" />
          <span className="truncate">{user?.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <PiPhoneCallFill className="text-gray-500" />
          <span>{user?.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default UsersDetailCard;
