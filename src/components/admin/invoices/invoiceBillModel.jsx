/* eslint-disable react/prop-types */
import { FaDiamond } from "react-icons/fa6";
import getEnv from "../../../configs/config";
import logoWithBackground from "../../../assets/logos/logo-with-bg.png";

const SectionHeader = ({ children }) => (
  <p className="text-[11px] font-medium text-primary flex items-center gap-1 mb-2">
    <FaDiamond size={8} /> {children}
  </p>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-[10px] py-0.5">
    <span className="font-semibold">{label}:</span>
    <span>{value ?? "-"}</span>
  </div>
);

const InvoiceBill = ({ invoice, isOpen, onClose }) => {
  if (!isOpen) return null;

  const adjustments = invoice.adjustments || [];
  const totalAdd = adjustments
    .filter((a) => a.type === "add")
    .reduce((sum, a) => sum + Number(a.amount), 0);
  const totalDeduct = adjustments
    .filter((a) => a.type === "deduction")
    .reduce((sum, a) => sum + Number(a.amount), 0);
  const netAdjustments = totalAdd - totalDeduct;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50">
      <div className="relative w-full max-w-3xl flex flex-col gap-6 p-6 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-2xl top-3 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        {/* Header */}
        <div className="flex flex-col mt-6 sm:flex-row items-center gap-4 justify-between border-b pb-3">
          <div className="flex gap-4 items-center">
            <img
              src={logoWithBackground}
              alt="warranty-system-logo"
              className="w-23 h-23"
            />
            <div className="flex flex-col">
              <p className="text-lg font-extrabold text-primary">
                {invoice?.owner?.companyName || "Precision Warranty Services"}
              </p>
              <span className="text-[10px]">Warranty Claim Invoice</span>
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3">
          <div className="flex flex-wrap gap-6">
            <InfoRow
              label="Date of Issue"
              value={new Date(invoice.createdAt).toLocaleDateString()}
            />
            <InfoRow label="Invoice Number" value={invoice.invoiceNumber} />
            <InfoRow label="Statement Type" value={invoice.statementType} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-primary flex items-center gap-1">
              <FaDiamond size={8} /> Final Total (USD)
            </span>
            <span className="text-xl font-extrabold text-primary">
              ${invoice.finalTotal?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Customer + Statement Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <SectionHeader>Customer Information</SectionHeader>
            <InfoRow label="Client Name" value={invoice.clientName} />
            <InfoRow label="Warranty Co." value={invoice.warrantyCompany} />
            <InfoRow label="Client Email" value={invoice?.clientId?.email} />
            <InfoRow label="Phone" value={invoice?.clientId?.phone} />
          </div>

          <div>
            <SectionHeader>Statement Information</SectionHeader>
            <InfoRow label="Type" value={invoice.statementType} />
            <InfoRow label="Number" value={invoice.statementNumber} />
            <InfoRow
              label="Total"
              value={`$${invoice.statementTotal?.toFixed(2)}`}
            />
            <InfoRow
              label="Assigned %"
              value={`${invoice.assignedPercentage || 0}%`}
            />
            <InfoRow
              label="Bypass"
              value={invoice.bypassPercentage ? "Yes" : "No"}
            />
          </div>
        </div>

        {/* Adjustments */}
        {adjustments.length > 0 && (
          <div className="border-t pt-3">
            <SectionHeader>Adjustments</SectionHeader>
            {adjustments.map((adj, idx) => (
              <InfoRow
                key={idx}
                label={adj.type === "add" ? "Charge" : "Deduction"}
                value={`$${adj.amount.toFixed(2)} (${adj.reason || "N/A"})`}
              />
            ))}
            <div className="mt-2 text-[10px] font-bold">
              Total Additions: ${totalAdd.toFixed(2)} | Total Deductions: $
              {totalDeduct.toFixed(2)} | Net: ${netAdjustments.toFixed(2)}
            </div>
          </div>
        )}

        {/* Reports */}
        {invoice.attachedReports?.length > 0 && (
          <div className="border-t pt-3">
            <SectionHeader>Attached Reports</SectionHeader>
            <ul className="text-[10px] space-y-1">
              {invoice.attachedReports.map((r) => (
                <li key={r._id}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    {r?.filename || r?.public_id?.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Explanation & Status */}
        <div className="border-t pt-3 text-[10px]">
          <InfoRow
            label="Explanation"
            value={invoice.freeTextExplanation || "N/A"}
          />
          <InfoRow label="Status" value={invoice.status?.toUpperCase()} />
          <InfoRow label="Sent Count" value={invoice.sentCount} />
          <InfoRow
            label="Last Sent"
            value={
              invoice.lastSent
                ? new Date(invoice.lastSent).toLocaleDateString()
                : "Never"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceBill;
