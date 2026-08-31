import CloseButton from "../../shared/small/CloseButton";

const AddClientModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-240 p-6 relative">
        <CloseButton onClick={onClose} />

        {children}
      </div>
    </div>
  );
};

export default AddClientModal;
