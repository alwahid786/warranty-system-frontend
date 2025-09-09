import { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";

const ClientsDetailCard = ({ client, onEdit, onDelete }) => {
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
    <div className="bg-white rounded-lg shadow p-4 relative">
      <div className="flex justify-between items-start">
        <div className="flex flex-col items-center gap-3">
          {client?.image && (
            <img
              src={client?.image}
              alt="client"
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          {!client.image && (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUserCircle className="text-gray-500" />
            </div>
          )}

          <div>
            <p className="font-medium font-inter text-dark-text text-sm">
              {client.name}
            </p>
            <p className="font-inter font-normal text-dark-text text-xs">
              ID #{client._id}
            </p>
          </div>
        </div>

        {/* 3-dot menu */}
        <div ref={menuRef} className="relative">
          <button
            className="text-black text-xl font-bold cursor-pointer"
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

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(client);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(client._id);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="bg-[#F2F7FF] p-4 rounded-xl mt-4 text-sm space-y-1">
        <div className="flex justify-between">
          <div>
            <p className="font-inter font-semibold text-dark-text">
              Claims Rate
            </p>
            <p className="font-medium text-[12px] text-dark-text">
              {client.claimsRate}
            </p>
          </div>
          <div className="text-right">
            <p className="font-inter font-semibold text-dark-text">
              Joining Date
            </p>
            <p className="font-medium text-[12px] text-dark-text text-start">
              {new Date(client.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-gray-800 mt-3">
          <MdEmail />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-800">
          <PiPhoneCallFill />
          <span>{client.phone}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientsDetailCard;
