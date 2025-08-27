const SessionExpiredModal = ({ onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.8)]  z-1000 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-[400px] rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[#111827] mb-4">
          Session Expired
        </h2>
        <p className="text-[#4B5563] mb-6">
          Your session has expired. Press OK to log in again.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
