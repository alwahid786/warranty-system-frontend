import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onSave, data, id }) => {
  if (!isOpen) return null;

  const handleOnSave = () => {
    onSave(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[350px] text-center">
        <h2 className="text-lg font-semibold mb-4">{data}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            No
          </button>
          <button
            onClick={handleOnSave}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
