import { useState } from "react";
import Button from "../../../components/shared/small/Button";
import Input from "../../../components/shared/small/input";
import { useDispatch } from "react-redux";
import authApis from "../../../redux/apis/authApis";
import { useLoginMutation } from "../../../redux/apis/authApis";
import { useForgetPasswordMutation } from "../../../redux/apis/authApis";
import { userExist, userNotExist } from "../../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logoWithOutBg from "../../../assets/logos/logo-without-bg.png";

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

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();

      if (res?.success && res?.data?._id) {
        toast.success(res?.message || "Login successful");
        // clear any existing user and set the freshly-logged-in user
        dispatch(userExist(res?.data));

        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Login failed", err);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
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
        <div className="relative bg-gradient h-[100vh] col-span-5 hidden lg:block">
          <img
            className="h-full w-full object-cover"
            src="/Frame 2085666744.png"
            alt="Background"
          />
          <img
            src={logoWithOutBg}
            alt="Precision Warranty Logo"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-auto"
          />
        </div>

        <div className="col-span-12 lg:col-span-7 flex items-center justify-center">
          <div className="flex w-full px-5 md:w-[60%] lg:w-full lg:px-[120px] flex-col gap-[35px] md:gap-[38px]">
            {forgotPassword ? null : resetPassword ? null : (
              <h1 className="text-[34px] text-center">Precision Warranty</h1>
            )}
            <div className="flex flex-col gap-[24px]">
              <p className="text-2xl font-semibold">
                {forgotPassword
                  ? "Forgot Password"
                  : resetPassword
                  ? "Reset Your Password"
                  : "Welcome to Precision Warranty"}
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
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLogin;
