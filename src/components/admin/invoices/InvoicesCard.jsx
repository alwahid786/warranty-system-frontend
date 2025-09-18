import clsx from "clsx";
import Button from "../../shared/small/Button";
import { useState, useRef, useEffect } from "react";
import styles from "./ivoicesCheckbox.module.css";
import InvoiceBill from "./invoiceBillModel";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import EditInvoiceForm from "./EditInvoiceForm";
import {
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useChangeInvoiceStatusMutation,
  useSendInvoiceMutation,
} from "../../../redux/apis/invoiceApis";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../utils/ConfirmationModal";
import { HiOutlinePencilSquare, HiOutlineLockClosed } from "react-icons/hi2";
import { saveAs } from "file-saver";

const statusColor = {
  draft: "bg-[#007AFF] text-white text-[14px] font-medium",
  finalized: "bg-[#FF3B30] text-white text-[14px] font-medium",
};

const statusIcons = {
  draft: <HiOutlinePencilSquare className="text-white w-6 h-6" />,
  finalized: <HiOutlineLockClosed className="text-white w-6 h-6" />,
};

export default function InvoiceCard({
  invoice,
  selected,
  onSelect,
  clientsData,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuRef = useRef(null);

  const [updateInvoice] = useUpdateInvoiceMutation();
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [changeInvoiceStatus] = useChangeInvoiceStatusMutation();
  const [sendInvoice] = useSendInvoiceMutation();

  const onEdit = () => {
    setIsEditOpen(true);
  };

  const onDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleDeleteInvoice = async (data) => {
    try {
      const res = await deleteInvoice({
        id: data,
      }).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  const handleEditDataSubmit = async (data) => {
    console.log(data.id);
    try {
      const res = await updateInvoice({
        id: data?.id,
        data: data?.data,
      }).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // change invoice status to finalize..-----
  const handleFinalizeInvoice = async (invoice) => {
    try {
      const res = await changeInvoiceStatus({
        id: invoice?._id,
        data: { status: "finalized" },
      }).unwrap();
      toast.success(res.message, { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  // send invoice on clients email address
  const handleSendInvoice = async (invoice) => {
    try {
      const blob = await sendInvoice({
        id: invoice?._id,
      }).unwrap();
      saveAs(blob, `invoice-${invoice?.invoiceNumber}.pdf`);
      toast.success(res.message || "Invoice sent", { duration: 3000 });
    } catch (err) {
      toast.error(err.data.message || "Failed to send", { duration: 3000 });
    }
  };

  return (
    <>
      <div
        className={`bg-white border border-[#ECECEC] rounded-[10px] p-4 shadow-sm space-y-3 ${
          selected ? "!bg-[#E4F5FF]" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center ">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect(invoice?._id)}
              className={styles.customCheckbox}
            />
            <div>
              <p className="font-inter font-medium text-[16px] text-[#043655] underline">
                INV-{invoice?.invoiceNumber}
              </p>
            </div>
          </div>
          <span
            className={clsx(
              "px-2 py-[6px] rounded flex items-center font-200 gap-2",
              statusColor[invoice?.status]
            )}
          >
            {statusIcons[invoice?.status]}{" "}
            {invoice?.status === "draft" ? "Draft" : "Finalized"}
          </span>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <div className="flex justify-between items-center ">
            <div className="font-inter font-bold text-[22px] text-[#043655]">
              <p>{invoice?.warrantyCompany}</p>
            </div>
            <div className="font-inter font-bold text-[14px] text-light text-dark-text ">
              <p>{invoice?.clientName}</p>
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <p className="font-inter font-medium text-[14px] text-dark-text ">
              Statement:
            </p>{" "}
            <div className="font-inter font-normal text-[12px] text-light text-dark-text ">
              <p>
                {invoice?.statementNumber} - {invoice?.statementType}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <p className="font-inter font-medium text-[14px] text-dark-text ">
              Invoice Date:
            </p>{" "}
            <p className="font-inter font-normal text-[12px] text-light text-dark-text ">
              {invoice.createdAt
                ? new Date(invoice.createdAt).toLocaleDateString("en-CA")
                : ""}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <p className="font-inter font-medium text-[14px] text-dark-text ">
              Statement Total:
            </p>
            <p className="font-inter font-normal text-[12px] text-light text-dark-text ">
              ${invoice?.statementTotal}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <p className="font-inter font-medium text-[14px] text-dark-text ">
              Adjustments:
            </p>{" "}
            <p>
              {invoice.adjustments.map((adj) => (
                <span
                  key={adj._id}
                  className={
                    adj.type === "add" ? "text-green-600" : "text-red-600"
                  }
                >
                  {adj.type === "add" ? "+" : "-"}
                  {adj.amount}
                </span>
              ))}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <p className="font-bold">Final Total:</p>
            <p className="font-bold text-primary">${invoice?.finalTotal}</p>
          </div>
        </div>

        <div className="flex justify-between space-x-[14px]">
          {/* Three Dots Menu (only if draft) */}
          {invoice?.status === "draft" && (
            <div className="relative" ref={menuRef}>
              <Button
                onClick={() => setMenuOpen(!menuOpen)}
                cn=" text-[14px] !py-2 !font-normal rounded-md truncate"
                bg="bg-primary"
                color="text-white"
                icon={<HiOutlineDotsHorizontal />}
              ></Button>

              {menuOpen && (
                <div className="absolute right--10 mt-2 w-22 border rounded-md shadow-lg z-20 flex flex-col">
                  <Button
                    onClick={() => {
                      onEdit(invoice);
                      setMenuOpen(false);
                    }}
                    text="Edit"
                    bg="bg-gray-600"
                    color="text-white"
                    cn=" text-[12px] !py-2 !font-small rounded-md truncate"
                  ></Button>
                  <Button
                    onClick={() => {
                      onDelete(invoice);
                      setMenuOpen(false);
                    }}
                    text="Delete"
                    bg="bg-red-600"
                    color="text-white"
                    cn="text-[12px] !py-2 !font-small rounded-md truncate"
                  ></Button>
                </div>
              )}
            </div>
          )}
          <Button
            text="View Details"
            bg="bg-primary"
            color="text-white"
            onClick={() => setIsModalOpen(true)}
            cn=" text-[14px] !py-2 !font-normal rounded-md truncate"
          />
          {invoice?.status === "draft" ? (
            <Button
              text="Finalize Invoice"
              bg="bg-[#B1B1B1]"
              color="text-white"
              cn=" !px-6 !py-2 text-[14px] !font-normal rounded-md truncate hover:!bg-[#6c757d]"
              onClick={() => handleFinalizeInvoice(invoice)}
            />
          ) : (
            <Button
              text="Send Invoice"
              bg="bg-[#B1B1B1]"
              color="text-white"
              cn=" !px-6 !py-2 text-[14px] !font-normal rounded-md truncate hover:!bg-[#6c757d]"
              onClick={() => handleSendInvoice(invoice)}
            />
          )}
        </div>
      </div>
      {isModalOpen && (
        <InvoiceBill
          invoice={invoice}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isEditOpen && (
        <EditInvoiceForm
          invoiceData={invoice}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          clientsData={clientsData}
          onSubmit={(e) => handleEditDataSubmit(e)}
        />
      )}
      {isDeleteOpen && (
        <ConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onSave={handleDeleteInvoice}
          data="Are you sure you want to delete this invoice?"
          id={invoice._id}
        />
      )}
    </>
  );
}
