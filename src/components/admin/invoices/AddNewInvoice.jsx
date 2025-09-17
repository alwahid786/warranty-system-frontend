import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const InvoiceForm = ({ isOpen, onClose, clientsData, outgoingData }) => {
  if (!isOpen) return null;

  const clients = clientsData?.data.map((client) => ({
    id: client._id,
    name: client.name,
    companyName: client.companyName,
  }));

  const [formData, setFormData] = useState({
    clientId: "",
    client: "",
    company: "",
    statementType: "",
    statementNumber: "",
    statementTotal: "",
    adjustments: [{ type: "Charge", amount: "", reason: "" }],
    assignedPercentage: "",
    finalTotal: "",
    bypass: false,
    explanation: "",
  });

  const [files, setFiles] = useState([]);

  // Dealer Change
  const onDealerChange = (e) => {
    const selectedClient = clients.find((c) => c.id === e.target.value);
    setFormData({
      ...formData,
      clientId: selectedClient?.id || "",
      client: selectedClient?.name || "",
      company: "",
    });
  };

  // Company Change
  const onCompanyChange = (e) => {
    setFormData({ ...formData, company: e.target.value });
  };

  // Adjustments handler
  const handleAdjustmentChange = (index, field, value) => {
    const newAdjustments = [...formData.adjustments];
    newAdjustments[index][field] = value;
    setFormData({ ...formData, adjustments: newAdjustments });
  };

  const addAdjustmentRow = () => {
    setFormData({
      ...formData,
      adjustments: [
        ...formData.adjustments,
        { type: "Charge", amount: "", reason: "" },
      ],
    });
  };

  const removeAdjustmentRow = (index) => {
    const newAdjustments = [...formData.adjustments];
    newAdjustments.splice(index, 1);
    setFormData({ ...formData, adjustments: newAdjustments });
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files);
    if (files.length + uploaded.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }
    setFiles([...files, ...uploaded]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // Calculation
  // automatically recalc when dependencies change
  useEffect(() => {
    let total = Number(formData.statementTotal) || 0;

    formData.adjustments.forEach((adj) => {
      const amt = Number(adj.amount) || 0;
      total += adj.type === "Charge" ? amt : -amt;
    });

    if (!formData.bypass) {
      const perc = Number(formData.assignedPercentage) || 0;
      total = total * (perc / 100);
    }

    setFormData((prev) => ({
      ...prev,
      finalTotal: total.toFixed(2),
    }));
  }, [
    formData.statementTotal,
    formData.adjustments,
    formData.assignedPercentage,
    formData.bypass,
  ]);

  // Save Handler
  // Save Handler
  const handleSave = async (finalize = false) => {
    // Basic validation
    if (!formData.client || !formData.company || !formData.statementTotal) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...formData,
      status: finalize ? "finalized" : "draft",
    };

    // Correct FormData usage
    const formDataObj = new FormData();

    Object.keys(payload).forEach((key) => {
      if (Array.isArray(payload[key])) {
        // For adjustments array
        formDataObj.append(key, JSON.stringify(payload[key]));
      } else {
        formDataObj.append(key, payload[key]);
      }
    });

    // Append files individually-------------
    files.forEach((file) => {
      formDataObj.append("files", file);
    });

    console.log("Sending to backend:", payload);

    outgoingData(formDataObj); // ✅ now you’re sending proper FormData

    toast.success(finalize ? "Invoice finalized" : "Draft saved");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute text-2xl top-3 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        {/* Header Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Header Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select className="border rounded p-2" onChange={onDealerChange}>
              <option value="">Choose Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              className="border rounded p-2"
              value={formData.company}
              onChange={onCompanyChange}
            >
              <option value="">Choose Company</option>
              {clients
                .filter((c) => c.name === formData.client)
                .map((c) => (
                  <option key={c.id} value={c.companyName}>
                    {c.companyName}
                  </option>
                ))}
            </select>
            <input type="file" className="border rounded p-2" />
          </div>
        </div>

        {/* Statement Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Statement Section</h2>
          <div className="space-x-4">
            {["Weekly", "Monthly", "Custom"].map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="statementType"
                  value={type}
                  checked={formData.statementType === type}
                  onChange={(e) =>
                    setFormData({ ...formData, statementType: e.target.value })
                  }
                />{" "}
                {type}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Statement Number"
              className="border rounded p-2"
              value={formData.statementNumber}
              onChange={(e) =>
                setFormData({ ...formData, statementNumber: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Statement Total"
              className="border rounded p-2"
              value={formData.statementTotal}
              onChange={(e) =>
                setFormData({ ...formData, statementTotal: e.target.value })
              }
            />
          </div>
        </div>

        {/* Adjustments */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Adjustments</h2>
          {formData.adjustments.map((adj, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-1 ${
                formData.adjustments.length > 1
                  ? "md:grid-cols-4"
                  : "md:grid-cols-3"
              } gap-4 items-center`}
            >
              <select
                className="border rounded p-2"
                value={adj.type}
                onChange={(e) =>
                  handleAdjustmentChange(idx, "type", e.target.value)
                }
              >
                <option>Charge</option>
                <option>Deduction</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                className="border rounded p-2"
                value={adj.amount}
                onChange={(e) =>
                  handleAdjustmentChange(idx, "amount", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Reason"
                className="border rounded p-2"
                value={adj.reason}
                onChange={(e) =>
                  handleAdjustmentChange(idx, "reason", e.target.value)
                }
              />
              {formData.adjustments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAdjustmentRow(idx)}
                  className="text-red-600 font-medium mt-2"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAdjustmentRow}
            className="text-blue-600 font-medium mt-2"
          >
            + Add Another
          </button>
        </div>

        {/* Calculation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Assigned Percentage"
              className={`border rounded p-2 ${
                formData.bypass ? "bg-gray-300 cursor-not-allowed" : ""
              }`}
              disabled={formData.bypass}
              value={formData.assignedPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assignedPercentage: e.target.value,
                })
              }
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.bypass}
                onChange={(e) =>
                  setFormData({ ...formData, bypass: e.target.checked })
                }
              />{" "}
              <span>Bypass Percentage</span>
            </label>
          </div>
          <div className="text-xl font-bold text-blue-700">
            Final Total: ${formData.finalTotal || "0.00"}
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Attachments</h2>
          <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer w-fit">
            Upload Files
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="relative border rounded-lg p-2 flex items-center space-x-2 bg-white shadow"
              >
                <span className="text-sm">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div>
            <textarea
              name="notes"
              id="notes"
              cols="30"
              rows="10"
              placeholder="Optional explanation..."
              className="border rounded p-2 w-full"
              onChange={(e) =>
                setFormData({ ...formData, explanation: e.target.value })
              }
            />
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Finalize
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
