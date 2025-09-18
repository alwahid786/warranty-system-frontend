import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditInvoiceForm = ({
  isOpen,
  onClose,
  clientsData,
  invoiceData,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const clients = clientsData?.data.map((client) => ({
    id: client._id,
    name: client.name,
    companyName: client.companyName,
  }));

  // Preload state with invoiceData
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

  const [files, setFiles] = useState([]); // new uploads
  const [existingFiles, setExistingFiles] = useState([]); // previously uploaded files

  // Hydrate with invoiceData
  useEffect(() => {
    if (invoiceData) {
      setFormData({
        clientId: invoiceData.clientId || "",
        client: invoiceData.clientName || "",
        company: invoiceData.warrantyCompany || "",
        statementType: invoiceData.statementType || "",
        statementNumber: invoiceData.statementNumber || "",
        statementTotal: invoiceData.statementTotal || "",
        adjustments: invoiceData.adjustments?.length
          ? invoiceData.adjustments
          : [{ type: "Charge", amount: "", reason: "" }],
        assignedPercentage: invoiceData.assignedPercentage || "",
        finalTotal: invoiceData.finalTotal || "",
        bypass: invoiceData.bypassPercentage || false,
        explanation: invoiceData.freeTextExplanation || "",
      });
      setExistingFiles(invoiceData.attachedReports || []);
    }
  }, [invoiceData]);

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
    setFormData((prev) => {
      const newAdjustments = prev.adjustments.map((adj, i) =>
        i === index ? { ...adj, [field]: value } : adj
      );

      return { ...prev, adjustments: newAdjustments };
    });
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
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index) => {
    setExistingFiles(existingFiles.filter((_, i) => i !== index));
  };

  // Auto calculation
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
  const handleSave = async (finalize = false) => {
    if (!formData.client || !formData.company || !formData.statementTotal) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...formData,
      status: finalize ? "finalized" : "draft",
      // keep track of files that remain vs removed
      existingFiles,
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

    onSubmit({
      id: invoiceData._id,
      data: formDataObj,
    }); // pass back

    toast.success(
      finalize ? "Invoice updated & finalized" : "Invoice draft updated"
    );
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

        <h2 className="text-xl font-bold">Edit Invoice</h2>

        {/* Header Section */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="client" className="font-semibold">
                Client
              </label>
              <select
                className="border rounded p-2"
                value={formData.clientId}
                onChange={onDealerChange}
              >
                <option value="">Choose Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="font-semibold">
                Warranty Company
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
          <h2 className="text-lg font-semibold">Statement</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="statementType" className="font-semibold">
              Statement Type
            </label>
            <div className="space-x-4">
              {["Weekly", "Monthly", "Custom"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="statementType"
                    value={type}
                    checked={formData.statementType === type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statementType: e.target.value,
                      })
                    }
                  />{" "}
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="statementNumber" className="font-semibold">
                Statement Number
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
            <div className="flex flex-col gap-2">
              <label htmlFor="statementTotal" className="font-semibold">
                Statement Total
              </label>
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
        </div>

        {/* Adjustments */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Adjustments</h2>
          {formData.adjustments.map((adj, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
            >
              <select
                className="border rounded p-2"
                value={adj.type === "add" ? "Charge" : "Deduction"}
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
                  className="text-red-600"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAdjustmentRow}
            className="text-blue-600"
          >
            + Add Another
          </button>
        </div>

        {/* Calculation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Calculation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="percentage" className="font-semibold">
                Percentage
              </label>
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
            </div>
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
          <h2 className="font-semibold">Attachments</h2>

          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer w-fit">
            Upload Files
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
          </label>
          <div className="flex flex-wrap gap-3 mt-5">
            {existingFiles.map((file, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-2 flex items-center space-x-2 bg-white shadow"
              >
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  {file.public_id}
                </a>
                <button
                  type="button"
                  onClick={() => removeExistingFile(idx)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-2 flex items-center space-x-2 bg-white shadow"
              >
                <span className="text-sm">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="explanation" className="font-semibold">
              Explanation(optional)
            </label>
            <textarea
              cols="30"
              rows="4"
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

export default EditInvoiceForm;
