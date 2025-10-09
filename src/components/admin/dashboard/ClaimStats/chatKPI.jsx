import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CompaniesResponseTimeCard = (data) => {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (data.data) {
      setCompanies(data?.data);
    }
  }, [data?.data]);

  return (
    <div className="bg-white rounded-xl border shadow flex-1 pb-6">
      <h2 className="font-medium text-[14px] leading-5 text-primary mb-4 px-4 mt-4">
        Companies Average Response Time
      </h2>

      {companies.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-6">
          No data available
        </p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB] border">
              <tr className="text-gray-500">
                <th className="text-left py-2 px-2 font-semibold text-[10px]">
                  COMPANY
                </th>
                <th className="text-right py-2 px-2 font-semibold text-[10px]">
                  RESPONSE TIME (mins)
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="py-2 px-5 font-medium text-[10px] text-primary">
                    {c.companyName}
                  </td>
                  <td className="py-2 px-5 text-right font-medium text-[10px] text-primary">
                    {Math.round(c.avgResponseTime)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* View All Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate("companies-response-time")}
              className="text-[#1C64F2] hover:text-[#143893] text-[12px] cursor-pointer"
            >
              View All
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CompaniesResponseTimeCard;
