import React, { useState, useEffect } from "react";

import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const EditClientsModal = ({ client, isOpen, onClose, onSave }) => {
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

  const [showPassword, setShowPassword] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (client) {
      setFormData({
        clientName: client.name || "",
        clientEmail: client.email || "",
        clientPhone: client.phone || "",
        clientPassword: "",
        storeName: client.storeName || "",
        dealerId: client.dealerId || "",
        address: {
          store: client.address?.store || "",
          street: client.address?.street || "",
          area: client.address?.area || "",
          city: client.address?.city || "",
          state: client.address?.state || "",
          country: client.address?.country || "",
          zip: client.address?.zip || ""
        },
        storePhone: client.storePhone || "",
        emails: client.emails?.length ? client.emails : [""],
        accountOwner: client.accountOwner || "",
        businessOwner: client.businessOwner || "",
        businessOwnerView: client.businessOwnerView || false,
        percentage: client.percentage || ""
      });
    }
  }, [client]);

  // handle address updates
  const handleAddressChange = (field, value) => {
    let filteredValue = value;

    if (field === "city" || field === "state") {
      filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    } else if (field === "zip") {
      filteredValue = value.replace(/\D/g, "");
    }

    setFormData({
      ...formData,
      address: { ...formData.address, [field]: filteredValue }
    });
  };

  // handle emails
  const handleEmailChange = (index, value) => {
    const updatedEmails = [...formData.emails];

    updatedEmails[index] = value;
    setFormData({ ...formData, emails: updatedEmails });
  };

  const addEmailField = () => {
    if (formData.emails.length >= 5)
      return toast.error("Maximum 5 emails allowed");
    setFormData({ ...formData, emails: [...formData.emails, ""] });
  };

  const removeEmailField = (index) => {
    const updatedEmails = formData.emails.filter((_, i) => i !== index);

    setFormData({ ...formData, emails: updatedEmails });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientName || !formData.clientEmail) {
      return toast.error("Client Name and Email are required");
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

    onSave(dataToSubmit);
  };

  //helper to format address labels
  // helper function
  const formatLabel = (field) => {
    const mapping = {
      store: "Store Name",
      street: "Street",
      area: "Main Area",
      city: "City",
      state: "State",
      country: "Country",
      zip: "Zip Code"
    };

    return mapping[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-240 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-7 right-8 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[80vh] overflow-y-auto pr-2"
        >
          {/* Section: Client Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Client Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  disabled // cannot change
                  className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Password
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
                    placeholder="Enter new password"
                    className="w-full border px-3 py-2 rounded pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Client Phone
                </label>
                <input
                  type="text"
                  value={formData.clientPhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isPlus = value.startsWith("+");
                    const digits = value.replace(/\D/g, "");

                    const finalValue =
                      (isPlus ? "+" : "") + digits.slice(0, 12);

                    setFormData({ ...formData, clientPhone: finalValue });
                  }}
                  className="w-full border px-3 py-2 rounded"
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
              <div className="flex flex-col gap-2 mt-1">
                <label
                  htmlFor="storeName"
                  className="block text-sm font-medium"
                >
                  Store Name
                </label>
                <input
                  type="text"
                  placeholder="Store Name"
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="Dealer ID"
                  className="block text-sm font-medium"
                >
                  Dealer ID
                </label>
                <input
                  type="text"
                  placeholder="Dealer ID"
                  value={formData.dealerId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setFormData({ ...formData, dealerId: value });
                  }}
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
              {[
                "store",
                "street",
                "area",
                "city",
                "state",
                "country",
                "zip"
              ].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="block text-sm font-medium">
                    {formatLabel(field)}
                  </label>
                  <input
                    type="text"
                    placeholder={formatLabel(field)}
                    value={formData.address[field]}
                    onChange={(e) => handleAddressChange(field, e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Store Contact
            </h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Store Phone
              </label>
              <input
                type="text"
                value={formData.storePhone}
                onChange={(e) => {
                  const value = e.target.value;
                  const isPlus = value.startsWith("+");
                  const digits = value.replace(/\D/g, "");
                  const finalValue = (isPlus ? "+" : "") + digits.slice(0, 12);

                  setFormData({ ...formData, storePhone: finalValue });
                }}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            {/* Dynamic Emails */}
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
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="accountOwner"
                  className="block text-sm font-medium"
                >
                  Account Owner
                </label>
                <input
                  type="text"
                  placeholder="Account Owner"
                  value={formData.accountOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, accountOwner: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="businessOwner"
                  className="block text-sm font-medium"
                >
                  Business Owner
                </label>
                <input
                  type="text"
                  placeholder="Business Owner"
                  value={formData.businessOwner}
                  onChange={(e) =>
                    setFormData({ ...formData, businessOwner: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
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
                <span className="text-sm font-medium">
                  Business owner can view invoices
                </span>
              </label>
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
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="sticky bottom-0 bg-white pt-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded w-full"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientsModal;
