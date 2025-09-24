import { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import {
  FaPhone,
  FaUserTie,
  FaUser,
  FaShareNodes,
  FaBell,
} from "react-icons/fa6";
import { MdLocationOn } from "react-icons/md";
import { HiPencil, HiTrash } from "react-icons/hi2";

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
    <div className="bg-white rounded-xl shadow-sm p-5 relative hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        {/* Avatar + Info */}
        <div className="flex items-center gap-4">
          {client?.image ? (
            <img
              src={client?.image}
              alt="client"
              className="w-14 h-14 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <FaUserCircle className="text-gray-400 text-3xl" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm md:text-base">
              {client.name}
            </p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                client?.activeStatus
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {client?.activeStatus ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Menu */}
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
                  onEdit(client);
                }}
                className="flex items-center gap-2 w-full text-left font-bold px-4 py-2 text-sm hover:bg-gray-50 text-gray-600"
              >
                <HiPencil className="text-gray-600" /> Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(client._id);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-bold hover:bg-gray-50 text-red-600"
              >
                <HiTrash className="text-red-600" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-100 p-4 rounded-lg mt-5 text-sm space-y-4">
        {/* Store & Joined */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-800">{client.storeName}</p>
            <p className="text-xs text-gray-500">
              Dealer ID: {client.dealerId}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-700">Joined</p>
            <p className="text-xs text-gray-500">
              {new Date(client.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Store Phone + Share */}
        <div className="flex justify-between text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <FaPhone className="text-gray-500" /> {client.storePhone}
          </span>
          <span className="flex items-center gap-1">
            <FaShareNodes className="text-gray-500" /> {client.percentage}%
            Share
          </span>
        </div>

        {/* Contact */}
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2 text-gray-700">
            <MdEmail className="text-gray-500" /> {client.email}
          </p>
          <p className="flex items-center gap-2 text-gray-700">
            <PiPhoneCallFill className="text-gray-500" /> {client.phone}
          </p>
        </div>

        {/* Address */}
        {client.address && (
          <p className="flex items-center gap-2 text-xs text-gray-600 leading-4">
            <MdLocationOn className="text-gray-500 text-base" />
            {[
              client.address.store,
              client.address.street,
              client.address.area,
              client.address.city,
              client.address.state,
              client.address.country,
              client.address.zip,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}

        {/* Owners */}
        <div className="flex justify-between items-center text-xs text-gray-700 border-t pt-3">
          <span className="flex items-center gap-2">
            <FaUser className="text-gray-500" /> Account Owner:{" "}
            {client.accountOwner}
          </span>
          <span className="flex items-center gap-1">
            <FaUserTie className="text-gray-500" /> {client.businessOwner}
            {client.businessOwnerView ? (
              <FaRegEye className="text-green-500" />
            ) : (
              <FaRegEyeSlash className="text-red-500" />
            )}
          </span>
        </div>

        {/* Notifications */}
        {client.emails?.length > 0 && (
          <div className="pt-2 border-t">
            <p className="flex items-center gap-2 font-medium text-xs text-gray-700 mb-2">
              <FaBell className="text-gray-500" /> Notifications
            </p>
            <div className="flex flex-wrap gap-2">
              {client.emails.map((em, i) => (
                <span
                  key={i}
                  className="bg-white border text-gray-600 text-xs px-2 py-1 rounded-full shadow-sm"
                >
                  {em}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsDetailCard;
