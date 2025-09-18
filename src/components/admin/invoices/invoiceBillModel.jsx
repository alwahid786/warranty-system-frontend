/* eslint-disable react/prop-types */
import { FaDiamond } from "react-icons/fa6";

const InvoiceBill = ({ invoice, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Customer Info
  const customerTable = [
    { key: "Client Name", value: invoice.clientName },
    { key: "Warranty Co.", value: invoice.warrantyCompany },
  ];

  // Statement Info
  const statementTable = [
    { key: "Type", value: invoice.statementType },
    { key: "Number", value: invoice.statementNumber },
    { key: "Total", value: `$${invoice.statementTotal?.toFixed(2)}` },
  ];

  // Adjustments
  const adjustmentTable = invoice.adjustments?.map((adj, idx) => ({
    key: `${adj.type === "add" ? "Addition" : "Deduction"} ${idx + 1}`,
    value: `$${adj.amount.toFixed(2)} (${adj.reason})`,
  }));

  // Reports
  const reports = invoice.attachedReports || [];

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50">
      <div className="relative flex flex-col gap-10 p-6 bg-white rounded-xl shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-2xl top-3 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        {/* Header */}
        <div className="flex flex-col mt-6 sm:flex-row items-center gap-4 justify-between">
          <div className="w-full sm:w-fit flex gap-4 items-center">
            <img src="/Vector.png" alt="logo" className="w-10 h-10" />
            <div className="flex flex-col">
              <p className="text-sm font-extrabold text-primary">
                National Warranty System
              </p>
              <span className="text-[10px]">Warranty Claim Invoice</span>
            </div>
          </div>
          <p className="text-xs font-semibold text-right">
            4825 Willow <br className="hidden sm:block" /> Drive, San Jose,{" "}
            <br className="hidden sm:block" /> CA 95129, USA
          </p>
        </div>

        {/* Invoice Info */}
        <div className="flex flex-col gap-5 pb-3 border-b-2 border-primary">
          <div className="flex flex-col sm:flex-row gap-5 justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-0.5">
                <p className="flex items-center gap-1 text-[11px] font-medium text-primary">
                  <FaDiamond size={8} /> Date of issue
                </p>
                <span className="text-[10px] font-semibold">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="flex items-center gap-1 text-[11px] font-medium text-primary">
                  <FaDiamond size={8} /> Invoice number
                </p>
                <span className="text-[10px] font-semibold">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="flex items-center gap-1 text-[11px] font-medium text-primary">
                  <FaDiamond size={8} /> Statement Type
                </p>
                <span className="text-[10px] font-semibold">
                  {invoice.statementType}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="flex items-center gap-1 text-[11px] font-medium text-primary">
                <FaDiamond size={8} /> Final Total (USD)
              </p>
              <span className="text-xl font-extrabold">
                ${invoice.finalTotal?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer + Statement Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <table>
              <thead>
                <tr>
                  <td
                    className="text-[11px] flex items-center gap-1 font-medium text-primary"
                    colSpan={2}
                  >
                    <FaDiamond size={8} /> Customer Information
                  </td>
                </tr>
              </thead>
              <tbody>
                {customerTable.map((item) => (
                  <tr key={item.key} className="flex gap-3">
                    <td className="w-[90px] text-[10px] font-semibold">
                      {item.key}:
                    </td>
                    <td className="text-[10px]">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <td
                    className="text-[11px] flex items-center gap-1 font-medium text-primary"
                    colSpan={2}
                  >
                    <FaDiamond size={8} /> Statement Information
                  </td>
                </tr>
              </thead>
              <tbody>
                {statementTable.map((item) => (
                  <tr key={item.key} className="flex gap-3">
                    <td className="w-[90px] text-[10px] font-semibold">
                      {item.key}:
                    </td>
                    <td className="text-[10px]">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adjustments */}
        {adjustmentTable?.length > 0 && (
          <div className="border-t-2 pt-3">
            <p className="text-[11px] font-medium text-primary flex items-center gap-1 mb-2">
              <FaDiamond size={8} /> Adjustments
            </p>
            <ul className="text-[10px] space-y-1">
              {adjustmentTable.map((adj) => (
                <li key={adj.key} className="flex justify-between">
                  <span className="font-semibold">{adj.key}:</span>
                  <span>{adj.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reports */}
        {reports.length > 0 && (
          <div className="border-t-2 pt-3">
            <p className="text-[11px] font-medium text-primary flex items-center gap-1 mb-2">
              <FaDiamond size={8} /> Attached Reports
            </p>
            <ul className="text-[10px] space-y-1">
              {reports.map((r) => (
                <li key={r._id}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    {r.public_id.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Explanation & Status */}
        <div className="border-t-2 pt-3 text-[10px]">
          <p>
            <span className="font-bold">Explanation:</span>{" "}
            {invoice.freeTextExplanation || "N/A"}
          </p>
          <p className="mt-1">
            <span className="font-bold">Status:</span>{" "}
            {invoice.status.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceBill;
