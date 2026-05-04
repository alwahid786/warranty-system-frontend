// components/InvoicesGrid.jsx
import React from "react";

import InvoiceCard from "./InvoicesCard";
// import InvoiceCard from "./InvoiceCard";

export default function InvoicesGrid({
  invoices,
  selectedIds,
  onChatOpen,
  onSelect,
  clientsData
}) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 col-span-full">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No invoices found</h3>
        <p className="text-gray-500 text-center max-w-xs">
          Try adjusting your filters or search terms to find what you&apos;re
          looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice._id}
          invoice={invoice}
          selected={selectedIds.includes(invoice._id)}
          onSelect={onSelect}
          onChatOpen={onChatOpen}
          clientsData={clientsData}
        />
      ))}
    </div>
  );
}
