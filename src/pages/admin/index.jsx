import { useEffect } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import Aside from "./layout/Aside";
import Header from "./layout/Header";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const isLogoMissing =
    user &&
    !user.companyLogo?.url &&
    !user.inheritedCompanyLogo &&
    user.role === "admin";

  useEffect(() => {
    if (isLogoMissing && location.pathname !== "/dashboard/settings") {
      toast.error(
        "Company logo is required. Please upload your company logo.",
        {
          id: "logo-required-toast"
        }
      );
      navigate("/dashboard/settings", { replace: true });
    }
  }, [isLogoMissing, location.pathname, navigate]);

  return (
    <section className="bg-[#F8F9FC] w-full h-screen h-[100dvh] flex items-center justify-center overflow-hidden">
      <section className="h-full w-full flex gap-3 lg:gap-5 p-2 md:px-4 md:py-3">
        <div className="hidden xl:block shrink-0">
          <Aside />
        </div>
        <div className="flex-1 min-w-0 pr-1 md:pr-3 overflow-hidden flex flex-col h-full">
          <div className="shrink-0">
            <Header />
          </div>
          <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-0 mt-3 lg:mt-5 rounded-lg pb-6 sm:pb-8">
            <Outlet />
          </main>
        </div>
      </section>
    </section>
  );
};

export default AdminDashboard;
