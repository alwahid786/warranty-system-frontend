import React, { useState } from "react";
import { FaUsers, FaUserCheck } from "react-icons/fa";
import { FaUserLargeSlash } from "react-icons/fa6";
import { MdOutlinePendingActions } from "react-icons/md";
import { HiChevronDown } from "react-icons/hi2";

const TopCards = ({ usersData, invoiceData }) => {
  // Dropdown state for each card
  const [range, setRange] = useState({
    users: "7",
    active: "7",
    inactive: "7",
    invoices: "7",
  });

  const formatChange = (value) => {
    if (!value)
      return { text: "0% same as last X days", color: "text-gray-500" };

    const sign = value > 0 ? "+" : "";
    const color =
      value > 0
        ? "text-green-600"
        : value < 0
        ? "text-red-600"
        : "text-gray-500";
    const word = value > 0 ? "better" : value < 0 ? "worse" : "same";

    return {
      text: `It's ${sign}${value}% ${word} than last X days`,
      color,
    };
  };

  const cards = [
    {
      id: "users",
      title: "Total Users",
      icon: (
        <FaUsers className="text-3xl text-[#043655] bg-[#EBF7FF] rounded-md p-1" />
      ),
      value: usersData?.userCount?.[`totalUser${range.users}`] ?? 0,
      change: usersData?.userCount?.[`percentUser${range.users}`] ?? 0,
    },
    {
      id: "active",
      title: "Active Users",
      icon: (
        <FaUserCheck className="text-3xl text-[#043655] bg-[#EBF7FF] rounded-md p-1" />
      ),
      value: usersData?.activeCount?.[`totalActive${range.active}`] ?? 0,
      change: usersData?.activeCount?.[`percentActive${range.active}`] ?? 0,
    },
    {
      id: "inactive",
      title: "Inactive Users",
      icon: (
        <FaUserLargeSlash className="text-3xl text-[#043655] bg-[#EBF7FF] rounded-md p-1" />
      ),
      value: usersData?.inactiveCount?.[`totalInactive${range.inactive}`] ?? 0,
      change:
        usersData?.inactiveCount?.[`percentInactive${range.inactive}`] ?? 0,
    },
    {
      id: "invoices",
      title: "Total Invoices",
      icon: (
        <MdOutlinePendingActions className="text-3xl text-red-400 bg-[#FCE7E766] rounded-md p-1" />
      ),
      value: invoiceData?.data?.[`totalInvoicesIn${range.invoices}Days`] ?? 0,
      change: invoiceData?.data?.[`percentageIn${range.invoices}Days`] ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const formatted = formatChange(card.change);

        return (
          <div
            key={card.id}
            className="bg-white rounded-[8px] shadow p-5 flex-1 min-w-[200px]"
          >
            {/* Header with icon + title + dropdown */}
            <div className="flex items-center gap-3 mb-5">
              {card.icon}
              <span className="font-semibold truncate text-primary">
                {card.title}
              </span>

              <div className="ml-auto relative">
                <select
                  className="text-xs text-gray-400 bg-white rounded px-2 py-1 outline-none shadow-sm focus:border-primary cursor-pointer"
                  value={range[card.id]}
                  onChange={(e) =>
                    setRange((prev) => ({ ...prev, [card.id]: e.target.value }))
                  }
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>
            </div>

            {/* Main value */}
            {/* Main value */}
            <div className="text-2xl font-semibold text-primary flex items-center gap-2">
              {card.value}

              {/* Percentage badge */}
              {card.change !== undefined && (
                <span
                  className={`text-sm px-2 py-0.5 rounded-full ${
                    card.change > 0
                      ? "bg-green-100 text-green-600"
                      : card.change < 0
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {card.change > 0 ? `+${card.change}%` : `${card.change}%`}
                </span>
              )}
            </div>

            {/* Percentage description */}
            <div className={`text-xs mt-1 ${formatted.color}`}>
              {formatted.text.replace("X", range[card.id])}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopCards;
