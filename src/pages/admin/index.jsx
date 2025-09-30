import { Outlet, useNavigate } from "react-router-dom";
import Aside from "./layout/Aside";
import Header from "./layout/Header";
import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
import SessionExpiredModal from "../../components/shared/small/SessionExpiredModal";

const AdminDashboard = () => {
  const [istokenexpired, setIsTokenExpired] = useState(false);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     let timeoutId;

  //     const checkTokenExpiryAndSetTimeout = async () => {
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //         try {
  //           const decodedToken = jwtDecode(token);
  //           const currentTime = Date.now() / 1000;
  //           if (decodedToken.exp && decodedToken.exp < currentTime) {
  //             setIsTokenExpired(true);
  //           } else if (decodedToken.exp) {
  //             const timeLeft = decodedToken.exp * 1000 - Date.now() - 60 * 1000;
  //             timeoutId = setTimeout(checkTokenExpiryAndSetTimeout, timeLeft);
  //           }
  //         } catch (error) {
  //           console.error("Invalid token");
  //         }
  //       }
  //     };

  //     checkTokenExpiryAndSetTimeout();

  //     return () => {
  //       if (timeoutId) {
  //         clearTimeout(timeoutId);
  //       }
  //     };
  //   }, [navigate]);

  //   const handleSessionExpired = () => {
  //     localStorage.removeItem("token");
  //     navigate("/login");
  //   };

  return (
    <section className="bg-[#F8F9FC] w-screen h-svh lg:h-screen grid place-items-center overflow-hidden">
      <section className="h-[calc(100vh-16px)] w-[calc(100vw-16px)] flex gap-5">
        <div className="hidden xl:block">
          <Aside />
        </div>
        <div className="flex-1 pr-3">
          <Header />
          <main className="h-[calc(100vh-110px)] overflow-y-scroll overflow-x-hidden scroll-0 mt-5 rounded-lg">
            <Outlet />
          </main>
        </div>
      </section>

      {/* Session Expired Modal */}
      {istokenexpired && (
        <SessionExpiredModal onConfirm={handleSessionExpired} />
      )}
    </section>
  );
};

export default AdminDashboard;
