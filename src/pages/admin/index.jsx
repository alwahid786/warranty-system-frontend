import { Outlet } from "react-router-dom";

import Aside from "./layout/Aside";
import Header from "./layout/Header";
// import { jwtDecode } from "jwt-decode";
// import SessionExpiredModal from "../../components/shared/small/SessionExpiredModal";

const AdminDashboard = () => {
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
    <section className="bg-[#F8F9FC] w-full h-svh lg:h-screen flex items-center justify-center overflow-hidden">
      <section className="h-[calc(100vh-16px)] w-full flex gap-3 lg:gap-5 px-2 md:px-4">
        <div className="hidden xl:block shrink-0">
          <Aside />
        </div>
        <div className="flex-1 min-w-0 pr-1 md:pr-3 overflow-hidden flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-0 mt-5 rounded-lg">
            <Outlet />
          </main>
        </div>
      </section>
    </section>
  );
};

export default AdminDashboard;
