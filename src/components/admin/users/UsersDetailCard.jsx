import { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { HiPencil, HiTrash, HiEllipsisVertical } from "react-icons/hi2";

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
    <div
      className={`bg-white rounded-2xl shadow-md p-5 relative hover:shadow-lg transition-all duration-300 ${
        menuOpen ? "z-30" : "z-0"
      }`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-4 flex-1 min-w-0">
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
              <p className="font-semibold text-gray-900 text-base truncate">
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
        <div ref={menuRef} className="relative shrink-0">
          <button
            className="p-2 -mr-1 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="More options"
          >
            <HiEllipsisVertical className="text-gray-600 text-2xl" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(user);
                }}
                className="flex items-center font-bold gap-3 w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
              >
                <HiPencil className="text-gray-600" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(user?._id);
                }}
                className="flex items-center font-bold gap-3 w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 text-red-600 border-t border-gray-50 transition-colors"
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
