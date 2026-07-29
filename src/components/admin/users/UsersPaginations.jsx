const UsersPagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex flex-wrap justify-center sm:justify-end items-center mt-6 gap-2 text-sm pb-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-2 py-1 disabled:text-gray-400 cursor-pointer"
    >
      &lt; Previous
    </button>

    <div className="flex flex-wrap justify-center items-center gap-1.5">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-8 h-8 rounded-md cursor-pointer ${
            currentPage === i + 1 ? "bg-primary text-white" : "text-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>

    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-2 py-1 disabled:text-gray-400 cursor-pointer"
    >
      Next &gt;
    </button>
  </div>
);

export default UsersPagination;
