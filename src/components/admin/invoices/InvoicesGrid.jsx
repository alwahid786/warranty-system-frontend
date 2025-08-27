// components/InvoicesGrid.jsx
import React from "react";
import InvoiceCard from "./InvoicesCard";
// import InvoiceCard from "./InvoiceCard";

export default function InvoicesGrid({
  invoices,
  selectedIds,
  onChatOpen,
  onSelect,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice._id}
          invoice={invoice}
          selected={selectedIds.includes(invoice._id)}
          onSelect={onSelect}
          onChatOpen={onChatOpen}
        />
      ))}
    </div>
  );
}
