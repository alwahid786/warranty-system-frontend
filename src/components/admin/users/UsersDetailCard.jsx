import { useState, useRef, useEffect } from "react";

import { useSelector } from "react-redux";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { HiPencil, HiTrash, HiEllipsisVertical } from "react-icons/hi2";

import { getInitials } from "../../../utils/getInitials";
import { formatPhoneNumber } from "../../../utils/formatters";

const UsersDetailCard = ({ user, onEdit, onDelete, canManage = true }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
          {/* User Avatar */}
          {user?.image?.url ||
          (typeof user?.image === "string" && user?.image) ? (
            <img
              src={user?.image?.url || user?.image}
              alt="User"
              className="w-14 h-14 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center border border-gray-200 text-white font-bold text-xl">
              {getInitials(user?.name)}
            </div>
          )}

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <p className="font-semibold text-gray-900 text-base truncate">
                {user?.name}
              </p>
              {/* Status Badge */}
              <span
                className={`w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${
                  user?.activeStatus
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.activeStatus ? "Active" : "Inactive"}
              </span>
            </div>
            {(user?.companyName || user?.storeName || user?.owner) && (
              <p className="text-[10px] text-blue-500 font-medium">
                Company Name:{" "}
                {user.companyName ||
                  user.storeName ||
                  user.owner?.companyName ||
                  user.owner?.storeName ||
                  user.owner?.name ||
                  user.owner?.email ||
                  "Unknown"}
              </p>
            )}
          </div>
        </div>

        {/* 3-dot menu */}
        {canManage && (
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
        )}
      </div>

      {/* Card Details */}
      <div className="mt-5 space-y-4">
        {/* Metrics Box */}
        <div className="grid grid-cols-2 rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden">
          <div className="p-4 border-r border-gray-100">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
              {user?.role === "admin" ||
              user?.role === "superadmin" ||
              user?.owner?.role === "admin"
                ? "Designation"
                : "Claims Rate"}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {user?.role === "admin" ||
              user?.role === "superadmin" ||
              user?.owner?.role === "admin"
                ? user?.designation || "N/A"
                : (user?.role === "user"
                    ? user?.owner?.percentage
                    : user?.percentage) || 0}
              {user?.role !== "admin" &&
                user?.role !== "superadmin" &&
                user?.owner?.role !== "admin" &&
                "%"}
            </p>
          </div>
          <div className="p-4 text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
              Joining Date
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </p>
          </div>
        </div>
        <div className="space-y-2.5 px-1">
          {["admin", "superadmin", "client"].includes(currentUser?.role) && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="font-medium text-gray-600 shrink-0">
                Last Login:
              </span>
              <span className="truncate">
                {user?.lastLogin
                  ? new Date(user?.lastLogin).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })
                  : "Never Logged In"}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-700">
            <MdEmail className="flex-shrink-0 text-gray-400" size={16} />
            <span className="min-w-0 truncate text-xs font-medium">
              {user?.email}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <PiPhoneCallFill
              className="flex-shrink-0 text-gray-400"
              size={16}
            />
            <span className="truncate text-xs font-medium">
              {formatPhoneNumber(user?.phone)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersDetailCard;
