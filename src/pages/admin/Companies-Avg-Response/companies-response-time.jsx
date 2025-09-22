import { useEffect, useState } from "react";
import { useGetCompaniesAvgResponseTimeAllQuery } from "../../../redux/apis/chatApis";
import { useNavigate } from "react-router";
import { HiArrowLeft } from "react-icons/hi2";

const CompaniesResponseTimePage = () => {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data } = useGetCompaniesAvgResponseTimeAllQuery({ page, limit: 10 });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setCompanies(data?.data);
      setTotalPages(data?.totalPages);
    }
  }, [data]);

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-primary text-yellow-300 text-3xl py-2 px-4 rounded-2xl"
      >
        <HiArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer" />
      </button>
      <h1 className="text-xl font-bold mb-4">All Companies Response Time</h1>

      <table className="w-full text-sm border">
        <thead className="bg-[#F9FAFB] border">
          <tr className="text-gray-500">
            <th className="text-left py-2 px-2">COMPANY</th>
            <th className="text-right py-2 px-2">RESPONSE TIME (mins)</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-2 px-5">{c.companyName}</td>
              <td className="py-2 px-5 text-right">
                {Math.round(c.avgResponseTime)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="text-sm px-2 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="text-sm px-2 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompaniesResponseTimePage;
