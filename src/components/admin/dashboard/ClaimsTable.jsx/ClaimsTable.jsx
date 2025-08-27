import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import Button from '../../../shared/small/Button';
import Modal from '../../../shared/small/Modal';
import Input from '../../../shared/small/input';

const ClaimsTable = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalSubject('');
    setModalMessage('');
  };
  const handleSendResponse = () => {
    // Add your send logic here
    handleCloseModal();
  };

  const columns = [
    {
      name: 'User Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: 'Date Submitted',
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: 'Message',
      selector: (row) => row.message,
      wrap: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            text={row.status}
            color="text-white justify-center text-xs"
            bg={row.status === 'Sent Successfully!' ? 'bg-secondary ' : 'bg-primary'}
            cn="!px-2 w-32 !py-2 !text-xs text-nowrap rounded"
            disabled={row.status === 'Sent Successfully!'}
            onClick={() => {
              if (row.status !== 'Sent Successfully!') handleOpenModal();
            }}
          />
          <Button
            text="View"
            color="text-[#043655] text-[12px]"
            bg="bg-white border border-[#043655] hover:!bg-gray-100"
            cn="!px-2 !py-2 !text-xs text-nowrap rounded"
          />
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        backgroundColor: '#f9fafb',
        color: '#374151',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        fontSize: '13px',
        height: '65px',
        display: 'flex',
        alignItems: 'center',
      },
    },
  };

  return (
    <div className="bg-white w-[97vw] md:w-[98vw] xl:w-full p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4 overflow-auto">Recent Contacts</h2>
      <div className="w-full overflow-auto">
        <DataTable
          columns={columns}
          data={data}
          responsive
          customStyles={customStyles}
          highlightOnHover
        />
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          text={
            <span className="flex items-center gap-1">
              View more <span>↗</span>
            </span>
          }
          bg="bg-primary hover:bg-[#0C6189]"
          color="text-white text-sm"
          cn="px-4 !py-2.5 !text-sm rounded-md flex items-center gap-1"
        />
      </div>
      {isModalOpen && (
        <Modal title="Respond to User Query" onClose={handleCloseModal} width="w-full max-w-3xl">
          <div className="flex flex-col gap-4">
            <p className="text-dark-text text-center">
              Send a personalized response to the user who submitted a query through the contact
              form. Fill in the subject and message fields to address their concerns directly.
            </p>
            <Input
              label={'Subject'}
              type="text"
              className="w-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="REG"
              value={modalSubject}
              onChange={(e) => setModalSubject(e.target.value)}
            />
            <div>
              <label className="text-sm md:text-base lg:text-xl text-dark-text">Message</label>
              <textarea
                className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="e.g., Thank you for reaching out to us. We've reviewed your message and would like to inform you that..."
                value={modalMessage}
                onChange={(e) => setModalMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-2 mt-2">
              <Button
                text="Cancel"
                bg="!bg-gray-400"
                color="!text-white"
                cn="px-4 py-2 hover:!bg-gray-500 rounded-md"
                onClick={handleCloseModal}
              />
              <Button
                text="Send Response"
                bg="bg-primary"
                color="text-white"
                cn="px-4 py-2 rounded-md"
                onClick={handleSendResponse}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClaimsTable;
