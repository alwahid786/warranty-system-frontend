import React, { useEffect, useState } from "react";
import TopCard from "../../../components/admin/dashboard/TopCard";
import { recentClaims } from "../../../data/data";
import TotalClaimsCard from "../../../components/admin/dashboard/ClaimStats/TotalclaimedsCard";
import ClaimsByBrandCard from "../../../components/admin/dashboard/ClaimStats/ClaimsByBrandCard";
import TopClaimBrandsChart from "../../../components/admin/dashboard/ClaimStats/TopClaimBrandsChart";
import { ClaimsTable } from "../../../components/admin/dashboard/ClaimsTable.jsx";
import CompaniesResponseTimeCard from "../../../components/admin/dashboard/ClaimStats/chatKPI";
import { useGetUsersStatQuery } from "../../../redux/apis/userApis";
import { useGetInvoicesStatQuery } from "../../../redux/apis/claimsApis";
import { useGetClaimsStatQuery } from "../../../redux/apis/claimsApis";
import { useGetCompaniesAvgResponseTimeQuery } from "../../../redux/apis/chatApis";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { data: invoicesData } = useGetInvoicesStatQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: usersStatsData } = useGetUsersStatQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: claimsStat } = useGetClaimsStatQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: companiesAvgResponseTime } =
    useGetCompaniesAvgResponseTimeQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const user = useSelector((state) => state.auth.user);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard/actions" replace />;
  }

  return (
    <>
      <TopCard usersData={usersStatsData} invoiceData={invoicesData} />
      <div className="mt-5 space-y-6">
        <h1 className="font-inter font-semibold  text-[14.4px] leading-6 text-primary">
          Claims Stats
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TotalClaimsCard data={claimsStat?.data} />
          <ClaimsByBrandCard brands={claimsStat?.claimsByCompany} />
          <CompaniesResponseTimeCard data={companiesAvgResponseTime} />
        </div>
        <div className="">
          <ClaimsTable data={recentClaims} />
        </div>
        {/* <div className="block md:hidden">
          <MobileViewClaimsTable data={claimsData} />
        </div> */}
      </div>
    </>
  );
};

export default Dashboard;
