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

  // normalize clients safely
  const clients = (clientsData?.data || []).map((c) => ({
    id: String(c._id),
    name: c.name || "",
    companyName: c.companyName || c.storeName || "",
  }));

  // main form state
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

  // files
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  // whether user changed fields that should trigger recalculation
  const [manualEdit, setManualEdit] = useState(false);

  // Hydrate with backend invoice data when it arrives
  useEffect(() => {
    if (!invoiceData) return;

    setFormData({
      clientId: invoiceData.clientId || "",
      client: invoiceData.clientName || "",
      company: invoiceData.warrantyCompany || "",
      statementType: invoiceData.statementType || "",
      statementNumber: invoiceData.statementNumber || "",
      statementTotal: invoiceData.statementTotal ?? "",
      adjustments:
        Array.isArray(invoiceData.adjustments) && invoiceData.adjustments.length
          ? invoiceData.adjustments
          : [{ type: "Charge", amount: "", reason: "" }],
      assignedPercentage: invoiceData.assignedPercentage ?? "",
      finalTotal:
        invoiceData.finalTotal !== undefined && invoiceData.finalTotal !== null
          ? Number(invoiceData.finalTotal).toFixed(2)
          : "",
      bypass: !!invoiceData.bypassPercentage || !!invoiceData.bypass,
      explanation: invoiceData.freeTextExplanation || "",
    });

    setExistingFiles(invoiceData.attachedReports || []);
    setManualEdit(false); // start with backend finalTotal trusted
  }, [invoiceData]);

  // If clients data arrives later, ensure name/company fields match clientId (help default selection)
  useEffect(() => {
    if (!formData.clientId || !clients.length) return;

    const selected = clients.find((c) => c.id === String(formData.clientId));
    if (!selected) return;

    setFormData((prev) => {
      // avoid unnecessary updates
      if (
        prev.client === selected.name &&
        prev.company === selected.companyName
      ) {
        return prev;
      }
      return { ...prev, client: selected.name, company: selected.companyName };
    });
    // don't flip manualEdit here (this is just sync)
  }, [clients, formData.clientId]);

  // Dealer Change (select client by id)
  const onDealerChange = (e) => {
    const clientId = e.target.value;
    const selectedClient = clients.find((c) => c.id === clientId);

    setFormData((prev) => ({
      ...prev,
      clientId: clientId || "",
      client: selectedClient?.name || "",
      company: selectedClient?.companyName || "",
    }));

    setManualEdit(true);
  };

  // Adjustments handlers (use functional updates)
  const handleAdjustmentChange = (index, field, value) => {
    setFormData((prev) => {
      const newAdjustments = prev.adjustments.map((adj, i) =>
        i === index ? { ...adj, [field]: value } : adj
      );
      return { ...prev, adjustments: newAdjustments };
    });
    setManualEdit(true);
  };

  const addAdjustmentRow = () => {
    setFormData((prev) => ({
      ...prev,
      adjustments: [
        ...prev.adjustments,
        { type: "Charge", amount: "", reason: "" },
      ],
    }));
    setManualEdit(true);
  };

  const removeAdjustmentRow = (index) => {
    setFormData((prev) => {
      const newAdjustments = [...prev.adjustments];
      newAdjustments.splice(index, 1);
      return { ...prev, adjustments: newAdjustments };
    });
    setManualEdit(true);
  };

  // File Upload Handler (include existingFiles in limit)
  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files || []);
    if (files.length + uploaded.length + existingFiles.length > 5) {
      toast.error("Maximum 5 files allowed (including existing attachments)");
      e.target.value = null;
      return;
    }
    setFiles((prev) => [...prev, ...uploaded]);
    e.target.value = null;
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Auto calculation of finalTotal
  useEffect(() => {
    // if backend provided finalTotal and user didn't edit relevant fields, keep backend value
    if (
      !manualEdit &&
      invoiceData &&
      invoiceData.finalTotal !== undefined &&
      invoiceData.finalTotal !== null
    ) {
      setFormData((prev) => ({
        ...prev,
        finalTotal: Number(invoiceData.finalTotal).toFixed(2),
      }));
      return;
    }

    // otherwise compute
    let total = Number(formData.statementTotal) || 0;

    (formData.adjustments || []).forEach((adj) => {
      const amt = Number(adj.amount) || 0;
      const type = String(adj.type || "").toLowerCase();
      // accept multiple possible type values from backend (add, charge, deduction, etc.)
      const isCharge = /charge|add|plus|credit|increase/i.test(type);
      total += isCharge ? amt : -amt;
    });

    // If bypass is false -> apply assigned percentage.
    // NOTE: if your business rule is different (e.g. subtract percentage), update accordingly.
    if (!formData.bypass) {
      const perc = Number(formData.assignedPercentage) || 0;
      // apply percent as proportion of total
      total = total * (perc / 100);
    }

    setFormData((prev) => ({
      ...prev,
      finalTotal: Number(total || 0).toFixed(2),
    }));
  }, [
    formData.statementTotal,
    formData.adjustments,
    formData.assignedPercentage,
    formData.bypass,
    manualEdit,
    invoiceData?.finalTotal,
  ]);

  // Save Handler
  const handleSave = async (finalize = false) => {
    if (
      !formData.clientId ||
      !formData.company ||
      !formData.statementTotal ||
      !formData.finalTotal
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...formData,
      status: finalize ? "finalized" : "draft",
      existingFiles,
    };

    const formDataObj = new FormData();

    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (Array.isArray(value) || typeof value === "object") {
        formDataObj.append(key, JSON.stringify(value));
      } else {
        formDataObj.append(
          key,
          value === undefined || value === null ? "" : String(value)
        );
      }
    });

    files.forEach((file) => formDataObj.append("files", file));

    // pass back
    onSubmit({
      id: invoiceData?._id,
      data: formDataObj,
    });

    toast.success(
      finalize ? "Invoice updated & finalized" : "Invoice draft updated"
    );
    onClose();
  };

  // helper: find selected client for company rendering
  const selectedClient = clients.find(
    (c) => c.id === String(formData.clientId)
  );

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        <button
          onClick={onClose}
          className="absolute text-2xl top-3 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold">Edit Invoice</h2>

        {/* Basic Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Client</label>
              <select
                className="border rounded p-2"
                value={formData.clientId || ""}
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
              <label className="font-semibold">Warranty Company</label>
              <div
                className={`p-2 rounded-lg border text-center font-medium 
      ${
        selectedClient
          ? "bg-blue-50 text-blue-800 border-blue-300"
          : "bg-gray-100 text-gray-500 border-gray-300"
      }
    `}
              >
                {selectedClient
                  ? selectedClient.companyName
                  : "Choose client name"}
              </div>
            </div>
          </div>
        </div>

        {/* Statement */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Statement</h2>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Statement Type</label>
            <div className="space-x-4">
              {["Weekly", "Monthly", "Custom"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="statementType"
                    value={type}
                    checked={formData.statementType === type}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        statementType: e.target.value,
                      }));
                      setManualEdit(true);
                    }}
                  />{" "}
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Statement Number</label>
              <input
                type="text"
                placeholder="Statement Number"
                className="border rounded p-2"
                value={formData.statementNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    statementNumber: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold">Statement Total</label>
              <input
                type="number"
                placeholder="Statement Total"
                className="border rounded p-2"
                value={formData.statementTotal}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    statementTotal: e.target.value,
                  }));
                  setManualEdit(true);
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
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
            >
              <select
                className="border rounded p-2"
                value={adj.type === "add" ? "Charge" : "Deduction"}
                onChange={(e) =>
                  handleAdjustmentChange(idx, "type", e.target.value)
                }
              >
                <option value="Charge">Charge</option>
                <option value="Deduction">Deduction</option>
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
              <label className="font-semibold">Percentage</label>
              <input
                type="number"
                placeholder="Assigned Percentage"
                className={`border rounded p-2 ${
                  formData.bypass ? "bg-gray-300 cursor-not-allowed" : ""
                }`}
                disabled={formData.bypass}
                value={formData.assignedPercentage}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    assignedPercentage: e.target.value,
                  }));
                  setManualEdit(true);
                }}
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!formData.bypass}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    bypass: e.target.checked,
                  }));
                  setManualEdit(true);
                }}
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
                  {file.public_id || file.name || `file-${idx + 1}`}
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
            <label className="font-semibold">Explanation (optional)</label>
            <textarea
              cols="30"
              rows="4"
              placeholder="Optional explanation..."
              className="border rounded p-2 w-full"
              value={formData.explanation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
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
