import { useState, useRef, useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaPhone,
  FaUserTie,
  FaUser,
  FaShareNodes,
  FaBell,
  FaRegBuilding,
  FaEnvelope,
} from "react-icons/fa6";
import {
  HiOutlineBuildingStorefront,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { MdLocationOn } from "react-icons/md";

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
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {client?.image ? (
            <img
              src={client.image}
              alt="client"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <FaUserCircle className="text-gray-500 text-3xl" />
            </div>
          )}

          <div>
            <p className="font-semibold text-dark-text text-sm">
              {client.name}
            </p>
            <p className="text-xs text-gray-500">ID #{client._id}</p>
          </div>
        </div>

        {/* Menu */}
        <div ref={menuRef} className="relative">
          <button
            className="text-black text-xl font-bold cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ⋮
          </button>
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

      {/* Info Section */}
      <div className="bg-[#F2F7FF] p-4 rounded-xl mt-4 text-sm space-y-3">
        {/* Row 1 */}
        <div className="flex justify-between">
          <div>
            <p className="font-semibold text-gray-700">{client.storeName}</p>
            <p className="text-xs text-gray-500">
              Dealer ID: {client.dealerId}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-700">Joined</p>
            <p className="text-xs text-gray-500">
              {new Date(client.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex justify-between">
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <FaPhone className="text-gray-500" /> {client.storePhone}
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <FaShareNodes className="text-gray-500" /> {client.percentage}%
            Share
          </p>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2 text-gray-800">
          <MdEmail className="text-lg" />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-800">
          <PiPhoneCallFill className="text-lg" />
          <span>{client.phone}</span>
        </div>

        {/* Address */}
        {client.address && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MdLocationOn className="text-gray-500 text-lg" />
            <span className="leading-4">
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
            </span>
          </div>
        )}

        {/* Owners */}
        <div className="flex justify-between items-center text-xs text-gray-700">
          <p className="text-xs text-gray-600 flex items-center gap-2">
            <FaUser className="text-gray-500" /> Account Owner:{" "}
            {client.accountOwner}
          </p>
          <span className="flex items-center gap-1">
            <FaUserTie className="text-gray-500" /> {client.businessOwner}{" "}
            {client.businessOwnerView ? (
              <FaRegEye className="text-green-500" />
            ) : (
              <FaRegEyeSlash className="text-red-500" />
            )}
          </span>
        </div>

        {/* Notifications */}
        {client.emails?.length > 0 && (
          <div className="mt-2">
            <p className="flex items-center gap-1 font-semibold text-xs text-gray-700 mb-1">
              <FaBell className="text-gray-500" />
              <span>Notifications</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {client.emails.map((em, i) => (
                <span
                  key={i}
                  className="bg-white border text-gray-600 text-xs px-2 py-1 rounded-full"
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
