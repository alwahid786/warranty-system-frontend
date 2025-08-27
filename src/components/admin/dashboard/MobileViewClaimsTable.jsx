const customers = [
  {
    id: "cust-001",
    username: "john Michal",
    email: "davidson@email.com",
    dateSubmitted: "April 15, 2025",
    message: "I'd like to know about…",
    actions: (
      <div className="flex gap-2 mt-2">
        <button className="bg-[#0C4F6C] text-white px-4 py-2 rounded">
          Send Response
        </button>
        <button className="border border-[#0C4F6C] text-[#0C4F6C] px-4 py-2 rounded">
          View
        </button>
      </div>
    ),
  },
  {
    id: "cust-002",
    username: "David Miler",
    email: "davidson@email.com",
    dateSubmitted: "April 15, 2025",
    message: "I'd like to know about…",
    actions: (
      <div className="flex gap-2 mt-2">
        <button className="bg-[#0C4F6C] text-white px-4 py-2 rounded">
          Send Response
        </button>
        <button className="border border-[#0C4F6C] text-[#0C4F6C] px-4 py-2 rounded">
          View
        </button>
      </div>
    ),
  },
  {
    id: "cust-003",
    username: "Sara Khan",
    email: "sarakhan@email.com",
    dateSubmitted: "April 15, 2025",
    message: "I'd like to know about…",
    actions: (
      <div className="flex gap-2 mt-2">
        <button className="bg-[#0C4F6C] text-white px-4 py-2 rounded">
          Send Response
        </button>
        <button className="border border-[#0C4F6C] text-[#0C4F6C] px-4 py-2 rounded">
          View
        </button>
      </div>
    ),
  },
  {
    id: "cust-004",
    username: "Jos Butler",
    email: "jos@email.com",
    dateSubmitted: "April 15, 2025",
    message: "I'd like to know about…",
    actions: (
      <div className="flex gap-2 mt-2">
        <button className="bg-primary text-white px-4 py-2 rounded">
          Send Response
        </button>
        <button className="border border-primary text-[#0C4F6C] px-4 py-2 rounded">
          View
        </button>
      </div>
    ),
  },
];
const MobileViewClaimsTable = ({ data }) => {
  return (
    <div className="w-full mx-auto bg-white border border-[#EAEDF2] rounded-[10px] p-4 ">
      <h2 className="font-inter font-medium text-[14px] text-[#101421] leading-[29px] mb-4 ">
        Recent Claims
      </h2>
      <div className="space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="border border-[#EAEDF2] rounded-[6px] p-4 shadow-sm"
          >
            <p className="font-inter font-normal text-[14px] tetx-[#101421]">
              User Name <br />
              <a
                href="#"
                className="font-inter font-medium text-[12px] text-[#143893] underline"
              >
                {customer?.username || ""}
              </a>
            </p>
            <p className="font-inter font-normal text-[14px] tetx-[#101421] mt-2 ">
              Email <br />
              <span className="font-inter font-normal text-[12px] text-[#535353] ">
                {customer?.email || "Not Found"}
              </span>
            </p>
            <p className="font-inter font-normal text-[14px] tetx-[#101421] mt-2 ">
              Date Submitted <br />
              <span className="font-inter font-normal text-[12px] text-[#535353] ">
                {customer?.dateSubmitted || "Not Found"}
              </span>
            </p>
            <p className="font-inter font-normal text-[14px] tetx-[#101421] mt-2 ">
              Message <br />
              <span className="font-inter font-normal text-[12px] text-[#535353] ">
                {customer?.message || "Not Found"}
                {/* {formatCreatedAtDateTime(customer?.joined_date) || "Not Found"} */}
              </span>
            </p>
            <div className="font-inter font-normal text-[14px] text-[#101421] mt-2">
              <p>Actions</p>
              <div className="mt-1">{customer?.actions || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileViewClaimsTable;
