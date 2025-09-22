import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

const EditClaimsModal = ({ isOpen, onClose, claim, onSubmit, isAdmin }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (claim) setFormData(claim);
  }, [claim]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData?.roNumber ||
      !formData?.roSuffix ||
      !formData?.roDate ||
      !formData?.jobNumber ||
      !formData?.quoted ||
      !formData?.status ||
      !formData?.entryDate ||
      !formData?.errorDescription
    ) {
      toast.error("Please fill out all fields", { duration: 3000 });
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-3xl font-semibold text-gray-800">Edit Claim</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: RO Information */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">RO Information</h3>
            <hr className="border-t border-gray-300 my-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="roNumber"
                  className="text-sm font-bold text-gray-700"
                >
                  RO Number
                </label>
                <input
                  type="text"
                  name="roNumber"
                  value={formData.roNumber || ""}
                  onChange={handleChange}
                  placeholder="RO Number"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="roSuffix"
                  className="text-sm font-bold text-gray-700"
                >
                  RO Suffix
                </label>
                <input
                  type="text"
                  name="roSuffix"
                  value={formData.roSuffix || ""}
                  onChange={handleChange}
                  placeholder="RO Suffix"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="roDate"
                  className="text-sm font-bold text-gray-700"
                >
                  RO Date
                </label>
                <input
                  type="date"
                  name="roDate"
                  value={formData.roDate || ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Job Information */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Job Information
            </h3>
            <hr className="border-t border-gray-300 my-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="jobNo"
                  className="text-sm font-bold text-gray-700"
                >
                  Job#
                </label>
                <input
                  type="text"
                  name="jobNumber"
                  value={formData.jobNumber || ""}
                  onChange={handleChange}
                  placeholder="Job Number"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="quoted"
                  className="text-sm font-bold text-gray-700"
                >
                  Quoted
                </label>
                <input
                  type="text"
                  name="quoted"
                  value={formData.quoted || ""}
                  onChange={handleChange}
                  placeholder="Quoted"
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="status"
                  className="text-sm font-bold text-gray-700"
                >
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Status</option>
                  <option value="PC">PC</option>
                  <option value="PO">PO</option>
                  <option value="PQ">PQ</option>
                  <option value="PR">PR</option>
                  <option value="PA">PA</option>
                  <option value="CR">CR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Dates */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Entry Date</h3>
            <input
              type="date"
              name="entryDate"
              value={formData.entryDate || ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Section 4: Descriptions */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Error Description
            </h3>
            <textarea
              name="errorDescription"
              value={formData.errorDescription || ""}
              onChange={handleChange}
              placeholder="Error Description"
              className="border p-2 rounded w-full h-20"
            />
            <h3 className="font-semibold text-gray-700 my-3">
              Additional Information
            </h3>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo || ""}
              onChange={handleChange}
              placeholder="Additional Information"
              className="border p-2 rounded w-full h-20 mt-4"
            />
          </div>

          {/* Section 5: Internal Notes (Admin Only) */}
          {isAdmin && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Internal Notes
              </h3>
              <textarea
                name="internalNotes"
                value={formData.internalNotes || ""}
                onChange={handleChange}
                placeholder="Internal Notes"
                className="border p-2 rounded w-full h-20"
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClaimsModal;
