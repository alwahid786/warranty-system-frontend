import { useState } from "react";
import Button from "../../../components/shared/small/Button";
import Input from "../../../components/shared/small/input";
import { useDispatch } from "react-redux";
import LandingHeader from "../../../components/public/landing-header/landing-header";
import {
  useGetMyProfileQuery,
  useLoginMutation,
} from "../../../redux/apis/authApis";
import { useForgetPasswordMutation } from "../../../redux/apis/authApis";
import { userExist, userNotExist } from "../../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGetNotificationsQuery } from "../../../redux/apis/notificationsApis";
import {
  resetNotifications,
  setNotifications,
} from "../../../redux/slices/notificationsSlice";
import notificationsApis from "../../../redux/apis/notificationsApis";

function AdminLogin() {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [forgetPassword, { isLoading: resetLoading, error: resetError }] =
    useForgetPasswordMutation();
  const { refetch } = useGetMyProfileQuery();
  const { refetch: notificationsRefetch } = useGetNotificationsQuery();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();

      if (res?.success || res?.data) {
        dispatch(notificationsApis.util.resetApiState());
        dispatch(resetNotifications());

        try {
          await refetch();
        } catch (e) {}
        try {
          await notificationsRefetch();
        } catch (e) {}

        toast.success(res?.message || "Login successful", { duration: 3000 });
        dispatch(userExist(res?.data));
        navigate("/dashboard");
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.data?.message || err?.message || "Login failed", {
        duration: 3000,
      });
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const res = await forgetPassword(formData).unwrap();
      dispatch(userExist(res.data));
      if (res.success) {
        toast.success(res.message, { duration: 3000 });
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <>
      {/* <LandingHeader /> */}
      <section className="grid grid-cols-12 h-screen">
        <div className="bg-gradient h-[100vh] col-span-5 hidden lg:block">
          <img
            className="h-full w-full object-cover"
            src="/Frame 2085666744.png"
            alt=""
          />
        </div>
        <div className="col-span-12 lg:col-span-7 flex items-center justify-center">
          <div className="flex w-full px-5 md:w-[60%] lg:w-full lg:px-[120px] flex-col gap-[35px] md:gap-[38px]">
            {forgotPassword ? null : resetPassword ? null : (
              <h1 className="text-[34px] text-center">National Warranty</h1>
            )}
            <div className="flex flex-col gap-[24px]">
              <p className="text-2xl font-semibold">
                {forgotPassword
                  ? "Forgot Password"
                  : resetPassword
                  ? "Reset Your Password"
                  : "Welcome to National Warranty"}
              </p>
              <form action="" className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                  <Input
                    required
                    type={resetPassword ? "password" : "email"}
                    value={
                      resetPassword ? formData.newPassword : formData.email
                    }
                    onChange={(e) => {
                      {
                        resetPassword
                          ? setFormData({
                              ...formData,
                              newPassword: e.target.value,
                            })
                          : setFormData({ ...formData, email: e.target.value });
                      }
                    }}
                    className="bg-white border"
                    label={resetPassword ? "New Password" : "Email"}
                  />
                  {forgotPassword ? null : resetPassword ? (
                    <Input
                      required
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        });
                      }}
                      className="bg-white border"
                      label={"Confirm Password"}
                    />
                  ) : (
                    <Input
                      required
                      type="password"
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                      }}
                      value={formData.password}
                      className="bg-white border"
                      label={"Password"}
                    />
                  )}
                  {forgotPassword ? null : resetPassword ? null : (
                    <p
                      className="text-right cursor-pointer  text-[#71717A] text-sm"
                      onClick={() => {
                        setFormData({ ...formData, email: "" });
                        setForgotPassword(true);
                      }}
                    >
                      Forgot Password
                    </p>
                  )}
                </div>
                <Button
                  cn={"justify-center"}
                  onClick={forgotPassword ? handleReset : handleLogin}
                  text={
                    forgotPassword
                      ? "Send Resent Link"
                      : resetPassword
                      ? "Reset Password"
                      : "Login"
                  }
                />
              </form>
            </div>
            <div className="flex flex-col gap-4">
              {forgotPassword || resetPassword ? (
                <p className="text-center">
                  No Account? {""}
                  <a href="/become-member" className="text-[#00235A]">
                    Create One
                  </a>
                </p>
              ) : null}
              <p className="text-center">
                By continuing, you agree to our{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  className="text-[#00235A]"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  className="text-[#00235A]"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLogin;
