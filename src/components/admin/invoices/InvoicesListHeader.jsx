import { useState } from "react";

import { LuPlus } from "react-icons/lu";
import toast from "react-hot-toast";

import Button from "../../shared/small/Button";
// import Button from "../../shared/small/Button";
import { ArchivedIcon } from "../../../assets/icons/icons";
import { useAddArchiveInvoicesMutation } from "../../../redux/apis/invoiceApis";
import { useRemoveArchiveInvoicesMutation } from "../../../redux/apis/invoiceApis";
import InvoiceForm from "./AddNewInvoice";
import { useAddInvoiceMutation } from "../../../redux/apis/invoiceApis";

const InvoicesListHeader = ({
  selectedIds,
  setSelectedIds,
  showImportExport = true,
  clientsData
}) => {
  const [addArchiveInvoices] = useAddArchiveInvoicesMutation();
  const [removeArchiveInvoices] = useRemoveArchiveInvoicesMutation();
  const [addInvoice] = useAddInvoiceMutation();

  const [isOpen, setIsOpen] = useState(false);

  const handleAddArchiveInvoices = async (e) => {
    e.preventDefault();
    try {
      if (showImportExport) {
        await addArchiveInvoices(selectedIds).unwrap();
      } else {
        await removeArchiveInvoices(selectedIds).unwrap();
      }

      setSelectedIds([]);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong", {
        duration: 3000
      });
    }
  };

  const handleOutGoingData = async (value) => {
    try {
      await addInvoice(value).unwrap();
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center p- rounded-md">
        {/* Title & Description */}
        <div className="">
          <h2 className="text-2xl font-medium font-inter text-primary">
            Invoices List
          </h2>
          <p className="text-sm font-inter font-medium text-secondary">
            Review, update, and organize the invoices. Use filters to sort by
            status, date, or brand.
          </p>
          {/* invoicessFilterBar below the title/description */}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap-reverse items-center gap-2 justify-end">
          {showImportExport && (
            <Button
              icon={<LuPlus className="text-xs sm:text-sm" />}
              text="Create New Invoice"
              bg="bg-[#04365599] hover:bg-slate-600"
              color="text-white"
              cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center"
              onClick={() => setIsOpen(true)}
            />
          )}
          <Button
            icon={<ArchivedIcon className="text-xs sm:text-sm" />}
            text={showImportExport ? "Move To Archive" : "Move Out of Archive"}
            bg="bg-[#04365599] hover:bg-slate-600"
            color="text-white"
            disabled={selectedIds?.length === 0}
            style={{
              cursor: selectedIds?.length === 0 ? "not-allowed" : "pointer",
              opacity: selectedIds?.length === 0 ? 0.6 : 1
            }}
            onClick={handleAddArchiveInvoices}
            cn="flex !py-2.5 text-xs sm:text-sm justify-center items-center truncate"
          />
        </div>
        <InvoiceForm
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          clientsData={clientsData}
          outgoingData={(e) => handleOutGoingData(e)}
        />
      </div>
    </>
  );
};

export default InvoicesListHeader;
