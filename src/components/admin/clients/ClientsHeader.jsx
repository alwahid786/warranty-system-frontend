import React, { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

import { formatPhoneNumber } from "../../../utils/formatters";
import {
  useAddClientMutation,
  useGetClientsStatByFiltersQuery,
  useGetClientsActivityStatsQuery
} from "../../../redux/apis/clientsApis";
import AddClientModal from "./AddClientModal";

const ClientsHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientPassword: "",
    storeName: "",
    dealerId: "",
    address: {
      store: "",
      street: "",
      area: "",
      city: "",
      state: "",
      country: "",
      zip: ""
    },
    storePhone: "",
    emails: [""],
    accountOwner: "",
    businessOwner: "",
    businessOwnerView: false,
    percentage: ""
  });

  // Handle nested address updates
  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  // Handle email updates
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...formData.emails];

    updatedEmails[index] = value;
    setFormData((prev) => ({ ...prev, emails: updatedEmails }));
  };

  // Add new email field
  const addEmailField = () => {
    if (formData.emails.length >= 5)
      return toast.error("Maximum 5 emails allowed");
    setFormData((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  };

  // Remove email field
  const removeEmailField = (index) => {
    const updatedEmails = [...formData.emails];

    updatedEmails.splice(index, 1);
    setFormData((prev) => ({ ...prev, emails: updatedEmails }));
  };

  const [addClient, { isLoading }] = useAddClientMutation();

  const { refetch: getClientsStatRefetch } = useGetClientsStatByFiltersQuery();

  const { refetch: getClientsActivityStatRefetch } =
    useGetClientsActivityStatsQuery();

  const resetForm = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientPassword: "",
      storeName: "",
      dealerId: "",
      address: {
        store: "",
        street: "",
        area: "",
        city: "",
        state: "",
        country: "",
        zip: ""
      },
      storePhone: "",
      emails: [""],
      accountOwner: "",
      businessOwner: "",
      businessOwnerView: false,
      percentage: ""
    });
    setShowPassword(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleAddClient = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.clientName ||
        !formData.clientEmail ||
        !formData.clientPassword ||
        !formData.storeName ||
        !formData.dealerId
      ) {
        return toast.error(
          "Client Name, Email, Password, Store Name and Dealer ID are required"
        );
      }

      if (!formData.clientPhone) {
        return toast.error("Client Phone is required");
      }

      if (!formData.address.city || !formData.address.zip) {
        return toast.error("City and Zip Code are required in address");
      }

      if (formData.percentage && Number(formData.percentage) > 100) {
        return toast.error("Percentage cannot exceed 100%");
      }

      // Filter out empty emails
      const filteredEmails = formData.emails.filter(
        (email) => email.trim() !== ""
      );

      const dataToSubmit = { ...formData, emails: filteredEmails };

      const res = await addClient(dataToSubmit).unwrap();

      toast.success(res.message, { duration: 3000 });
      if (res.success) {
        handleClose();
        await getClientsStatRefetch();
        await getClientsActivityStatRefetch();
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl font-semibold">Clients List</h1>
          <p className="text-sm text-gray-500">Manage all your Clients</p>
        </div>

        {/* Button to open modal */}
        <button
          onClick={() => setIsOpen(true)}
          className="py-2 bg-primary text-base text-white px-4 rounded-sm"
        >
          + Add New Clients
        </button>
      </div>

      {/* Modal */}
      <AddClientModal isOpen={isOpen} onClose={handleClose}>
        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
        <form
          className="space-y-6 max-h-[80vh] overflow-y-auto pr-2"
          onSubmit={handleAddClient}
          autoComplete="off"
        >
          {/* Section: Client Credentials */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Client Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  placeholder="Enter Client Name"
                  className="w-full border px-3 py-2 rounded"
                  autoComplete="off"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, clientEmail: e.target.value })
                  }
                  placeholder="Enter Client Email"
                  className="w-full border px-3 py-2 rounded"
                  autoComplete="off"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.clientPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clientPassword: e.target.value
                      })
                    }
                    placeholder="Enter Password"
                    className="w-full border px-3 py-2 rounded pr-10"
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
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientPhone}
                  onChange={(e) => {
                    const formattedValue = formatPhoneNumber(e.target.value);

                    setFormData({ ...formData, clientPhone: formattedValue });
                  }}
                  placeholder="(XXX) XXX-XXXX"
                  className="w-full border px-3 py-2 rounded"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Section: Store Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Store Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  placeholder="Enter Store Name"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Dealer ID */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Dealer ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.dealerId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setFormData({ ...formData, dealerId: value });
                  }}
                  placeholder="Enter Dealer ID"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Store Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Store"
                value={formData.address.store}
                onChange={(e) => handleAddressChange("store", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Street"
                value={formData.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Main Area"
                value={formData.address.area}
                onChange={(e) => handleAddressChange("area", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="City *"
                value={formData.address.city}
                onChange={(e) =>
                  handleAddressChange(
                    "city",
                    e.target.value.replace(/[^a-zA-Z\s]/g, "")
                  )
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.address.state}
                onChange={(e) =>
                  handleAddressChange(
                    "state",
                    e.target.value.replace(/[^a-zA-Z\s]/g, "")
                  )
                }
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Zip Code *"
                value={formData.address.zip}
                onChange={(e) =>
                  handleAddressChange("zip", e.target.value.replace(/\D/g, ""))
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Section: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Store Contact
            </h3>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Store Phone
              </label>
              <input
                type="text"
                value={formData.storePhone}
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);

                  setFormData({ ...formData, storePhone: formattedValue });
                }}
                placeholder="(XXX) XXX-XXXX"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Emails Dynamic */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Who will receive the notifications
              </label>
              {formData.emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter email"
                    className="w-full border px-3 py-2 rounded"
                  />
                  {formData.emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="p-2 bg-red-500 text-white rounded"
                    >
                      <MdClose size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addEmailField}
                className="text-blue-500 text-md font-medium mt-2"
              >
                + Add another
              </button>
            </div>
          </div>

          {/* Section: Ownership */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Ownership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Account Owner
                </label>
                <input
                  type="text"
                  value={formData.accountOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, accountOwner: e.target.value })
                  }
                  placeholder="Enter Account Owner Name"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Business Owner
                </label>
                <input
                  type="text"
                  value={formData.businessOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, businessOwner: e.target.value })
                  }
                  placeholder="Enter Business Owner Name"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.businessOwnerView}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessOwnerView: e.target.checked
                    })
                  }
                  className="h-4 w-4"
                />
                <label className="text-sm font-medium">
                  Business owner can view invoices
                </label>
              </div>
            </div>
          </div>

          {/* Section: Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Settings
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Add Percentage (%)
              </label>
              <input
                type="number"
                value={formData.percentage}
                onChange={(e) => {
                  let value = e.target.value;

                  if (value > 100) value = 100;
                  if (value < 0) value = 0;
                  setFormData({ ...formData, percentage: value });
                }}
                placeholder="Enter %"
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white pt-4">
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
          </div>
        </form>
      </AddClientModal>
    </div>
  );
};

export default ClientsHeader;
