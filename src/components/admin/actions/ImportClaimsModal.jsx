import { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { LuUpload } from "react-icons/lu";

import Modal from "../../shared/small/Modal";
import Button from "../../shared/small/Button";

const ImportClaimsModal = ({
  isOpen,
  onClose,
  clients = [],
  defaultClientId = "",
  onImport
}) => {
  const [selectedClientId, setSelectedClientId] = useState(defaultClientId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedClientId(defaultClientId || "");
      setSelectedFile(null);
      setIsLoading(false);
    }
  }, [isOpen, defaultClientId]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Please upload a valid CSV file", { duration: 3000 });
        setSelectedFile(null);
        e.target.value = null;

        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClientId) {
      toast.error("Please select a client", { duration: 3000 });

      return;
    }

    if (!selectedFile) {
      toast.error("Please select a CSV file to upload", { duration: 3000 });

      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("targetClientId", selectedClientId);

    try {
      setIsLoading(true);
      await onImport(formData);
      onClose();
    } catch (err) {
      console.error("Import error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Import Claims"
      onClose={onClose}
      width="w-[90%] sm:w-[500px] lg:w-[550px]"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Field 1: Client Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Select Client <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            required
          >
            <option value="">-- Select Client --</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.companyName || client.storeName || client.name}
              </option>
            ))}
          </select>
        </div>

        {/* Field 2: File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Upload CSV File <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors bg-gray-50">
            <input
              type="file"
              id="csv-file-input"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="csv-file-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <LuUpload className="text-3xl text-primary" />
              <span className="text-sm font-medium text-gray-700">
                {selectedFile
                  ? selectedFile.name
                  : "Click to select a CSV file"}
              </span>
              <span className="text-xs text-gray-500">
                Only .csv files supported
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button
            type="button"
            text="Cancel"
            bg="bg-gray-100 hover:bg-gray-200"
            color="text-gray-700"
            onClick={onClose}
            disabled={isLoading}
            cn="!py-2 !px-4 text-sm hover:text-white"
          />
          <Button
            type="submit"
            text={isLoading ? "Importing..." : "Import Claims"}
            bg="bg-primary hover:bg-sky-900"
            color="text-white"
            disabled={!selectedClientId || !selectedFile || isLoading}
            cn="!py-2 !px-4 text-sm flex items-center justify-center"
            style={{
              opacity:
                !selectedClientId || !selectedFile || isLoading ? 0.6 : 1,
              cursor:
                !selectedClientId || !selectedFile || isLoading
                  ? "not-allowed"
                  : "pointer"
            }}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ImportClaimsModal;
