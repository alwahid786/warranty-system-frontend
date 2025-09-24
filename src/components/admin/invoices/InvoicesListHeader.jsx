import { MdOutlineFileDownload } from "react-icons/md";
import { LuUpload, LuPlus } from "react-icons/lu";
import Button from "../../shared/small/Button";
// import Button from "../../shared/small/Button";
import { ArchievedIcon } from "../../../assets/icons/icons";
import { useAddArchieveInvoicesMutation } from "../../../redux/apis/invoiceApis";
import { useRemoveArchieveInvoicesMutation } from "../../../redux/apis/invoiceApis";
import InvoiceForm from "./AddNewInvoice";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAddInvoiceMutation } from "../../../redux/apis/invoiceApis";

const InvoicesListHeader = ({
  selectedIds,
  setSelectedIds,
  showImportExport = true,
  clientsData,
}) => {
  const [addArchieveInvoices] = useAddArchieveInvoicesMutation();
  const [removeArchieveInvoices] = useRemoveArchieveInvoicesMutation();
  const [addInvoice] = useAddInvoiceMutation();

  const [isOpen, setIsOpen] = useState(false);

  const handleAddArchieveInvoices = async (e) => {
    e.preventDefault();
    try {
      if (showImportExport) {
        const res = await addArchieveInvoices(selectedIds).unwrap();
        toast.success(res.message, { duration: 3000 });
      } else {
        const res = await removeArchieveInvoices(selectedIds).unwrap();
        toast.success(res.message, { duration: 3000 });
      }

      setSelectedIds([]);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong", {
        duration: 3000,
      });
    }
  };

  const handleOutGoingData = async (value) => {
    try {
      const res = await addInvoice(value).unwrap();
      toast.success(res.message, { duration: 3000 });
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
            Claims List
          </h2>
          <p className="text-sm font-inter font-medium text-secondary">
            Review, update, and organize user-submitted warranty claims. Use
            filters to sort by status, date, or brand.
          </p>
          {/* ClaimsFilterBar below the title/description */}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 justify-end">
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
            icon={<ArchievedIcon className="text-xs sm:text-sm" />}
            text={showImportExport ? "Move To Archive" : "Move Out of Archive"}
            bg="bg-[#04365599] hover:bg-slate-600"
            color="text-white"
            disabled={selectedIds?.length === 0}
            style={{
              cursor: selectedIds?.length === 0 ? "not-allowed" : "pointer",
              opacity: selectedIds?.length === 0 ? 0.6 : 1,
            }}
            onClick={handleAddArchieveInvoices}
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
