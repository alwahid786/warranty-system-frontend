// components/InvoiceCard.jsx
import clsx from "clsx";
import Button from "../../shared/small/Button";
import { useState } from "react";
import Modal from "../../shared/small/Modal";
import { FaDiamond } from "react-icons/fa6";
import styles from "./ivoicesCheckbox.module.css";

const statusColor = {
  Applied: "bg-[#007AFF] text-white text-[14px] font-medium",
  "Pending Credits": "bg-[#FFCC00] text-white text-[14px] font-medium truncate",
  Rejected: "bg-[#FF3B30] text-white text-[14px] font-medium",
};

export default function InvoiceCard({
  invoice,
  selected,
  onSelect,
  onChatOpen,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customerTable = [
    { key: "Name", value: "John D. Mitchell" },
    { key: "Email", value: "john.mitchell@email.com" },
    { key: "Phone", value: "(555) 234-9876" },
    { key: "Address", value: "4825 Willow Drive, San Jose, CA 95129, USA" },
  ];
  const VehicleTable = [
    { key: "Make", value: "Toyota" },
    { key: "Modal", value: "Camry XLE" },
    { key: "VIN", value: "1HGCM82633A004352" },
    { key: "Purchase Date", value: "February 15, 2023" },
    { key: "Authorized Dealer", value: "Toyota Sunnyvale, CA" },
  ];
  const serviceDescriptionTable = [
    { key: "Engine Noise Diagnosis", value: "CLM-5432" },
    { key: "Battery Replacement", value: "CLM-5417" },
    { key: "Full System Diagnostic Scan", value: "CLM-5398" },
  ];
  const statusTable = [
    { key: "Approved", value: 150 },
    { key: "Approved", value: 600 },
    { key: "Approved", value: 231 },
  ];

  const subTotal = statusTable.reduce((sum, item) => {
    return sum + item.value;
  }, 0);
  const tax = 100;
  const total = subTotal + tax;
  const warrantyAmount = 700;
  const amountDue = total - warrantyAmount;

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
              onChange={() => onSelect(invoice._id)}
              className={styles.customCheckbox}
            />
            <div>
              <p className="font-inter font-medium text-[16px] text-[#043655] underline">
                {invoice.claimId}
              </p>
              <p className="font-normal font-inter text-[12px] text-[#1A1A1A]">
                {invoice.dealer}
              </p>
            </div>
          </div>
          <span
            className={clsx(
              "px-2 py-[6px] rounded",
              statusColor[invoice.status]
            )}
          >
            {invoice.status}
          </span>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <div className="flex justify-between items-center ">
            <p className="font-inter font-medium text-[14px] text-dark-text ">
              RO#:
            </p>{" "}
            <p className="font-inter font-normal text-[12px] text-light text-dark-text ">
              {invoice.roNumber} - {invoice.roSuffix}
            </p>
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
              Total Credit:
            </p>
            <p className="font-inter font-normal text-[12px] text-light text-dark-text ">
              ${invoice.totalCost}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <p className="font-inter font-medium text-[14px] text-dark-text ">
              Claim Type:
            </p>{" "}
            <p className="font-inter font-normal text-[12px] text-light text-dark-text ">
              {invoice.claimType}
            </p>
          </div>
          <div className="flex justify-between items-center ">
            <p className="font-inter font-medium text-[14px] text-dark-text ">
              Invoice #:
            </p>{" "}
            <p className="font-inter font-normal text-[12px] text-light ">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>

        <div className="flex justify-between space-x-[14px]">
          <Button
            text="Chat"
            bg="bg-[#B1B1B1]"
            color="text-white"
            cn=" !px-6 !py-2 text-[14px] !font-normal rounded-md hover:!bg-[#6c757d] truncate"
            onClick={() => onChatOpen(invoice)}
            //   onClick={handleSendResponse}
          />
          <Button
            text="View Details"
            bg="bg-primary"
            color="text-white"
            onClick={() => setIsModalOpen(true)}
            cn=" text-[14px] !py-2 !font-normal rounded-md truncate"
          />
          <Button
            text="Upload Docs"
            bg="bg-[#B1B1B1]"
            color="text-white"
            cn=" !px-6 !py-2 text-[14px] !font-normal rounded-md truncate hover:!bg-[#6c757d]"
          />
        </div>
      </div>
      {isModalOpen && (
        <Modal
          width={"!w-full sm:!w-[600px] !rounded-lg"}
          onClose={() => setIsModalOpen(false)}
        >
          <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="w-full sm:w-fit flex gap-4 items-center">
                <img src="/Vector.png" alt="" />
                <div className="flex flex-col">
                  <p className="text-sm font-extrabold !text-primary">
                    National Warranty System
                  </p>
                  <span className="text-[10px]">Warranty Clam Invoice</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-right">
                4825 Willow <br className="hidden sm:block" /> Drive, San Jose,{" "}
                <br className="hidden sm:block" /> CA 95129, USA
              </p>
            </div>
            <div>
              <div className="flex flex-col gap-5 pb-3 border-b-2 border-primary">
                <div className="flex flex-col sm:flex-row gap-5 justify-between">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-0.5">
                      <p className="flex items-center gap-1 text-[11px] font-medium !text-primary">
                        <FaDiamond size={8} /> Date of issue
                      </p>
                      <span className="text-[10px] font-semibold">
                        {invoice.createdAt}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="flex items-center gap-1 text-[11px] font-medium !text-primary">
                        <FaDiamond size={8} /> Invoice number
                      </p>
                      <span className="text-[10px] font-semibold">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="flex items-center gap-1 text-[11px] font-medium !text-primary">
                        <FaDiamond size={8} /> Due Date
                      </p>
                      <span className="text-[10px] font-semibold">
                        07-Jan-2025
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="flex items-center gap-1 text-[11px] font-medium !text-primary">
                      <FaDiamond size={8} /> Amount Due (CAD)
                    </p>
                    <span className="text-xl font-extrabold">{`$${amountDue.toFixed(
                      2
                    )}`}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="w-[200px]">
                    <table>
                      <thead>
                        <tr>
                          <td
                            className="text-[11px] flex items-center gap-1 font-medium !text-primary"
                            colSpan={2}
                          >
                            <FaDiamond size={8} /> Customer Information
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {customerTable.map((item) => (
                          <tr key={item.key} className="flex gap-3">
                            <td className="w-[45px] text-[10px] font-semibold">
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
                            className="text-[11px] flex items-center gap-1 font-medium !text-primary"
                            colSpan={2}
                          >
                            <FaDiamond size={8} /> Vehicle Information
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {VehicleTable.map((item) => (
                          <tr key={item.key} className="flex gap-3">
                            <td className="w-[91px] text-[10px] font-semibold">
                              {item.key}:
                            </td>
                            <td className="text-[10px]">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-20 gap-y-4">
                <div className="col-span-2 sm:col-span-1">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <td className="text-[9px] font-medium !text-primary">
                          Service Description
                        </td>
                        <td className="text-right text-[9px] font-medium !text-primary">
                          Claim ID
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceDescriptionTable.map((item) => (
                        <tr key={item.key}>
                          <td className="text-[8px] text-secondary">
                            {item.key}
                          </td>
                          <td className="text-[8px] text-secondary text-right">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <td className="text-[9px] font-medium !text-primary">
                          Status
                        </td>
                        <td className="text-[9px] font-medium !text-primary text-right">
                          Amount (USD)
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      {statusTable.map((item) => (
                        <tr key={item.key}>
                          <td className="text-[8px] text-secondary">
                            {item.key}
                          </td>
                          <td className="text-[8px] text-secondary text-right">{`$${item.value.toFixed(
                            2
                          )}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-x-20">
                  <div className="col-span-2 sm:col-span-1" />
                  <div className="col-span-2 sm:col-span-1 border-b-2 pb-2">
                    <p className="flex justify-between text-[8px] text-secondary">
                      <span>Sub Total</span>
                      <span>{`$${subTotal.toFixed(2)}`}</span>
                    </p>
                    <p className="flex justify-between text-[8px] text-secondary">
                      <span>Tax</span>
                      <span>{`$${tax.toFixed(2)}`}</span>
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1" />
                  <div className="col-span-2 sm:col-span-1 border-b-2 py-2">
                    <p className="flex justify-between text-[8px] text-secondary">
                      <span>Total</span>
                      <span>{`$${total.toFixed(2)}`}</span>
                    </p>
                    <p className="flex justify-between text-[8px] text-secondary">
                      <span>Warranty Amount</span>
                      <span>{`$${warrantyAmount.toFixed(2)}`}</span>
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1" />
                  <p className="col-span-2 sm:col-span-1 pt-2 flex justify-between text-[10px] font-bold text-secondary">
                    <span>Amount Due (CAD)</span>
                    <span className="text-[11px]">{`$${amountDue.toFixed(
                      2
                    )}`}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
