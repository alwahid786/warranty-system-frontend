import React, { useState } from "react";
import AddClientModal from "./AddClientModal";
import { Phone } from "lucide-react";
import { useAddClientMutation } from "../../../redux/apis/clientsApis";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

const ClientsHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    dealerId: "",
    address: {
      store: "",
      street: "",
      area: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    phone: "",
    emails: [""],
    accountOwner: "",
    businessOwner: "",
    businessOwnerView: false,
    percentage: "",
  });

  // Handle nested address updates
  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
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
    setFormData((prev) => ({ ...prev, emails: [...prev.emails, ""] }));
  };

  // Remove email field
  const removeEmailField = (index) => {
    const updatedEmails = [...formData.emails];
    updatedEmails.splice(index, 1);
    setFormData((prev) => ({ ...prev, emails: updatedEmails }));
  };

  const [addClient, { isLoading }] = useAddClientMutation();

  const handleAddClient = async (e) => {
    e.preventDefault();

    try {
      const res = await addClient(formData).unwrap();
      toast.success(res.message, { duration: 3000 });
      if (res.success) {
        setIsOpen(false);
        setFormData({
          storeName: "",
          dealerId: "",
          address: {
            store: "",
            street: "",
            area: "",
            city: "",
            state: "",
            country: "",
            zip: "",
          },
          phone: "",
          emails: [""],
          accountOwner: "",
          businessOwner: "",
          businessOwnerView: false,
          percentage: "",
        });
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
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

      {/* Modal */}
      <AddClientModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
        <form
          className="space-y-6 max-h-[80vh] overflow-y-auto pr-2"
          onSubmit={handleAddClient}
        >
          {/* Section: Store Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Store Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Store Name
                </label>
                <input
                  type="text"
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
                  Dealer ID
                </label>
                <input
                  type="text"
                  value={formData.dealerId}
                  onChange={(e) =>
                    setFormData({ ...formData, dealerId: e.target.value })
                  }
                  placeholder="Enter Dealer ID"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Address
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
                placeholder="City"
                value={formData.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
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
                placeholder="Zip Code"
                value={formData.address.zip}
                onChange={(e) => handleAddressChange("zip", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Section: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1">
              Contact
            </h3>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Phone Number"
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
                      businessOwnerView: e.target.checked,
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
                onChange={(e) =>
                  setFormData({ ...formData, percentage: e.target.value })
                }
                placeholder="Enter %"
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
              Save
            </button>
          </div>
        </form>
      </AddClientModal>
    </div>
  );
};

export default ClientsHeader;
