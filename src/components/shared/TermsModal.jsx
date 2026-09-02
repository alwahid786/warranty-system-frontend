import { useState } from "react";

import toast from "react-hot-toast";

import { useAcceptTermsMutation } from "../../redux/apis/authApis";
import useLogoutHandler from "../../utils/useLogoutHandler";
import CloseButton from "./small/CloseButton";

const TermsModal = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [acceptTerms, { isLoading: isAccepting }] = useAcceptTermsMutation();
  const { handleLogout, isLoading: isLoggingOut } = useLogoutHandler();

  const handleAccept = async () => {
    if (!accepted) {
      toast.error("Please accept the terms to continue");

      return;
    }
    try {
      await acceptTerms().unwrap();
      onAccept();
      toast.success("Terms accepted! Welcome.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept terms");
    }
  };

  const sections = [
    {
      num: 1,
      title: "Acceptance of Terms",
      text: "By using the Warranty Management System, you agree to comply with all rules and regulations set forth by the administrator. Unauthorized access or use of this system is strictly prohibited."
    },
    {
      num: 2,
      title: "Data Privacy",
      text: "Your data is protected under our strict privacy policy. We ensure that your client information and claim details are encrypted and secure. Your information will never be shared with third parties without your explicit consent."
    },
    {
      num: 3,
      title: "Usage Responsibilities",
      text: "As a client or user, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify the administrator immediately of any breach of security."
    },
    {
      num: 4,
      title: "System Integrity",
      text: "Any attempt to misuse, manipulate, or compromise the system's integrity will lead to immediate account suspension and potential legal action."
    },
    {
      num: 5,
      title: "Updates to Terms",
      text: "We reserve the right to update these terms at any time. Continued use of the system implies acceptance of the updated terms. We recommend reviewing these terms periodically."
    }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 z-[10000] p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-gray-100 p-5 sm:p-6 bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Terms of Usage
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please review and accept our terms to activate your account.
            </p>
          </div>
          <CloseButton
            onClick={() => handleLogout()}
            disabled={isLoggingOut}
            title="Decline and Logout"
          />
        </div>

        {/* Modal Content / Terms List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white space-y-6 divide-y divide-gray-100">
          {sections.map((sec, idx) => (
            <div
              key={sec.num}
              className={`flex items-start gap-4 ${idx > 0 ? "pt-6" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-base flex items-center justify-center shrink-0 mt-0.5">
                {sec.num}
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900">
                  {sec.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {sec.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 shrink-0 border-t border-gray-100 bg-white">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-[#0F2C59] checked:border-[#0F2C59] transition-all"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <svg
                  className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-900 group-hover:text-black transition-colors">
                I have read and accept the terms and conditions
              </span>
            </label>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 mt-1">
              <button
                className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl border-2 border-red-200 text-red-600 font-bold bg-red-50 hover:bg-red-600 hover:text-white active:bg-red-100 transition-all cursor-pointer disabled:opacity-50 text-sm sm:text-base"
                onClick={() => handleLogout()}
                disabled={isAccepting || isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
              <button
                className={`w-full sm:flex-[2] py-2.5 sm:py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all text-sm sm:text-base
                  ${
                    accepted && !isAccepting
                      ? "bg-primary hover:bg-primary-dark active:scale-[0.98] shadow-black/20"
                      : "bg-gray-300 cursor-not-allowed shadow-none"
                  }`}
                onClick={handleAccept}
                disabled={!accepted || isAccepting}
              >
                {isAccepting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Activating Account...
                  </span>
                ) : (
                  "Accept & Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
