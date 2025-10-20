import { useState } from "react";
import Button from "../../../components/shared/small/Button";
import Input from "../../../components/shared/small/input";
import { useResetPasswordMutation } from "../../../redux/apis/authApis";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AdminResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const { token } = useParams();

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ ...formData, token }).unwrap();
      if (res.success) {
        toast.success(res.message, { duration: 3000 });
        navigate("/");
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <section className="grid grid-cols-12 h-screen">
      {/* Left Image Section */}
      <div className="bg-gradient h-[100vh] col-span-5 hidden lg:block">
        <img
          className="h-full w-full object-cover"
          src="/Frame 2085666744.png"
          alt="Reset Password Illustration"
        />
      </div>

      {/* Right Form Section */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center">
        <div className="flex w-full px-5 md:w-[60%] lg:w-full lg:px-[120px] flex-col gap-[35px] md:gap-[38px]">
          <h1 className="text-[34px] text-center">National Warranty</h1>
          <div className="flex flex-col gap-[24px]">
            <p className="text-2xl font-semibold">Reset Your Password</p>
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-10"
            >
              <div className="flex flex-col gap-2">
                <Input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-white border"
                  label="New Password"
                />
                <Input
                  required
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="bg-white border"
                  label="Confirm Password"
                />
              </div>

              <Button cn="justify-center" text="Reset Password" type="submit" />
            </form>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-center">
              Remembered your password?{" "}
              <a href="/login" className="text-[#00235A]">
                Back to Login
              </a>
            </p>
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
  );
}

export default AdminResetPassword;
