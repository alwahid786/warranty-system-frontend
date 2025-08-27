const UsersPagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-end items-center mt-6 gap-2 text-sm">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-2 py-1 disabled:text-gray-400"
    >
      &lt; Previous
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`w-8 h-8 rounded-md ${
          currentPage === i + 1 ? "bg-primary text-white" : "text-gray-700"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-2 py-1 disabled:text-gray-400"
    >
      Next &gt;
    </button>
  </div>
);

export default UsersPagination;
