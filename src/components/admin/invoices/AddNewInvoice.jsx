import React, { useState, useEffect } from "react";

import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

import CloseButton from "../../shared/small/CloseButton";

const InvoiceForm = ({ isOpen, onClose, clientsData, outgoingData }) => {
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
    bypass: true,
    explanation: ""
  });

  const [files, setFiles] = useState([]);

  const resetForm = () => {
    setFormData({
      clientId: "",
      client: "",
      company: "",
      statementType: "",
      statementNumber: "",
      statementTotal: "",
      adjustments: [{ type: "Charge", amount: "", reason: "" }],
      assignedPercentage: "",
      finalTotal: "",
      bypass: true,
      explanation: ""
    });
    setFiles([]);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // calculation effect must be called before early return
  useEffect(() => {
    if (!isOpen) return;
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
      finalTotal: total.toFixed(2)
    }));
  }, [
    formData.statementTotal,
    formData.adjustments,
    formData.assignedPercentage,
    formData.bypass,
    isOpen
  ]);

  if (!isOpen) return null;

  const clients = (clientsData?.data || []).map((client) => ({
    id: client?._id,
    name: client?.name,
    companyName: client?.companyName || client?.storeName,
    percentage: client?.percentage ?? ""
  }));

  // Dealer Change
  const onDealerChange = (e) => {
    const selectedClient = clients.find((c) => c.id === e.target.value);
    let perc = selectedClient?.percentage ?? "";

    if (
      perc !== "" &&
      perc !== null &&
      perc !== undefined &&
      Number(perc) > 100
    ) {
      perc = 100;
    }
    const isEmptyPerc = perc === "" || perc === null || perc === undefined;

    setFormData({
      ...formData,
      clientId: selectedClient?.id || "",
      client: selectedClient?.name || "",
      company: "",
      assignedPercentage: perc,
      bypass: isEmptyPerc ? true : false
    });
  };

  // Company Change
  const onCompanyChange = (e) => {
    setFormData({ ...formData, company: e.target.value });
  };

  // Adjustments handler
  const handleAdjustmentChange = (index, field, value) => {
    if (field === "amount" && value !== "" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const newAdjustments = [...formData.adjustments];

    newAdjustments[index][field] = value;
    setFormData({ ...formData, adjustments: newAdjustments });
  };

  const addAdjustmentRow = () => {
    setFormData({
      ...formData,
      adjustments: [
        ...formData.adjustments,
        { type: "Charge", amount: "", reason: "" }
      ]
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

  // Save Handler

  const handleSave = async (finalize = false) => {
    // Form validation
    if (!formData.clientId) {
      return toast.error("Please select a client");
    }
    if (!formData.company) {
      return toast.error("Please select a company");
    }
    if (!formData.statementType) {
      return toast.error("Please select a statement type");
    }
    if (!formData.statementNumber) {
      return toast.error("Please enter a statement number");
    }
    if (formData.statementTotal === "" || formData.statementTotal === null) {
      return toast.error("Please enter a statement total");
    }
    if (
      !formData.bypass &&
      (formData.assignedPercentage === "" ||
        formData.assignedPercentage === null)
    ) {
      return toast.error("Please enter an assigned percentage or check bypass");
    }
    if (
      !formData.bypass &&
      (Number(formData.assignedPercentage) > 100 ||
        Number(formData.assignedPercentage) < 0)
    ) {
      return toast.error("Percentage cannot be more than 100%");
    }

    const payload = {
      ...formData,
      status: finalize ? "finalized" : "draft"
    };

    const formDataObj = new FormData();

    Object.keys(payload).forEach((key) => {
      if (Array.isArray(payload[key])) {
        formDataObj.append(key, JSON.stringify(payload[key]));
      } else {
        formDataObj.append(key, payload[key]);
      }
    });

    files.forEach((file) => {
      formDataObj.append("files", file);
    });

    outgoingData(formDataObj);

    toast.success(finalize ? "Invoice finalized" : "Draft saved");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {/* Close */}
        <CloseButton onClick={onClose} />
        <h2 className="text-xl font-bold">Add Invoice</h2>

        {/* Header Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Choose Client <span className="text-red-500">*</span>
              </label>
              <select
                className="border rounded p-2"
                onChange={onDealerChange}
                value={formData.clientId}
              >
                <option value="">Choose Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Choose Company <span className="text-red-500">*</span>
              </label>
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
            </div>
          </div>
        </div>

        {/* Statement Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">
            Statement <span className="text-red-500">*</span>
          </h2>
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Statement Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Statement Number"
                className="border rounded p-2"
                value={formData.statementNumber}
                onChange={(e) =>
                  setFormData({ ...formData, statementNumber: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Statement Total <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Statement Total"
                className="border rounded p-2"
                value={formData.statementTotal}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setFormData({ ...formData, statementTotal: value });
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Adjustments */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Adjustments</h2>
          {formData.adjustments.map((adj, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center"
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
                type="text"
                inputMode="decimal"
                placeholder="Amount"
                className="border rounded p-2"
                value={adj.amount}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    handleAdjustmentChange(idx, "amount", value);
                  }
                }}
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
              {idx > 0 ? (
                <div className="flex justify-end md:justify-start">
                  <button
                    type="button"
                    onClick={() => removeAdjustmentRow(idx)}
                    className="text-red-600 font-medium"
                    title="Remove adjustment"
                  >
                    <span className="hidden md:inline">
                      <X size={15} strokeWidth={2.5} />
                    </span>
                    <span className="inline-flex md:hidden items-center gap-1.5">
                      Cancel
                    </span>
                  </button>
                </div>
              ) : (
                <div
                  className="invisible flex justify-end md:justify-start"
                  aria-hidden="true"
                >
                  <button type="button" className="font-medium" tabIndex="-1">
                    <span className="hidden md:inline">
                      <X size={15} strokeWidth={2.5} />
                    </span>
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addAdjustmentRow}
              className="text-blue-600 font-medium mt-2 flex items-center gap-1.5"
            >
              <Plus size={15} strokeWidth={2.5} />
              Add Another
            </button>
          </div>
        </div>

        {/* Calculation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">
                Assigned Percentage{" "}
                {!formData.bypass && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Assigned Percentage"
                className={`border rounded p-2 ${
                  formData.bypass ? "bg-gray-300 cursor-not-allowed" : ""
                }`}
                disabled={formData.bypass}
                value={formData.assignedPercentage}
                onChange={(e) => {
                  let val = e.target.value;

                  if (val === "" || /^\d*\.?\d*$/.test(val)) {
                    if (val !== "" && Number(val) > 100) {
                      val = "100";
                    }

                    const isEmpty =
                      val === "" || val === null || val === undefined;

                    setFormData({
                      ...formData,
                      assignedPercentage: val,
                      bypass: isEmpty ? true : formData.bypass
                    });
                  }
                }}
              />
            </div>
            <label className="flex items-center space-x-2 mt-6">
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
              value={formData.explanation}
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
