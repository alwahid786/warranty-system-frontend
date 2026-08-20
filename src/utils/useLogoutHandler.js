import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authApis, { useLogoutMutation } from "../redux/apis/authApis";
import claimsApis from "../redux/apis/claimsApis";
import chatApis from "../redux/apis/chatApis";
import notificationsApis from "../redux/apis/notificationsApis";
import clientApis from "../redux/apis/clientsApis";
import invoiceApis from "../redux/apis/invoiceApis";
import userApis from "../redux/apis/userApis";
import paymentApis from "../redux/apis/paymentApis";
import { userNotExist } from "../redux/slices/authSlice";
import { setNotifications } from "../redux/slices/notificationsSlice";
import { clearSelectedUser } from "../redux/slices/userSlice";

export const useLogoutHandler = () => {
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetAllStoreState = () => {
    // Reset all RTK Query API caches
    dispatch(authApis.util.resetApiState());
    dispatch(claimsApis.util.resetApiState());
    dispatch(chatApis.util.resetApiState());
    dispatch(notificationsApis.util.resetApiState());
    dispatch(clientApis.util.resetApiState());
    dispatch(invoiceApis.util.resetApiState());
    dispatch(userApis.util.resetApiState());
    dispatch(paymentApis.util.resetApiState());

    // Reset Redux slice states
    dispatch(userNotExist());
    dispatch(clearSelectedUser());
    dispatch(setNotifications([]));
  };

  const handleLogout = async (onSuccessCallback) => {
    try {
      const res = await logoutMutation().unwrap();

      resetAllStoreState();

      if (typeof onSuccessCallback === "function") {
        onSuccessCallback();
      }

      toast.success(res?.message || "Logged out successfully", {
        duration: 3000
      });
      navigate("/", { replace: true });
    } catch (err) {
      resetAllStoreState();
      console.error("err", err);

      if (typeof onSuccessCallback === "function") {
        onSuccessCallback();
      }

      toast.success("Logged out successfully", { duration: 3000 });
      navigate("/", { replace: true });
    }
  };

  return { handleLogout, isLoading };
};

export default useLogoutHandler;
