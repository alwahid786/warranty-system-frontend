import React, { useState } from 'react';
import { useAcceptTermsMutation, useLogoutMutation } from '../../redux/apis/authApis';
import toast from 'react-hot-toast';
import { MdClose } from 'react-icons/md';

const TermsModal = ({ onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [acceptTerms, { isLoading: isAccepting }] = useAcceptTermsMutation();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.reload();
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleAccept = async () => {
    if (!accepted) {
      toast.error('Please accept the terms to continue');
      return;
    }
    try {
      await acceptTerms().unwrap();
      onAccept();
      toast.success('Terms accepted! Welcome.');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to accept terms');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/60 z-[10000] p-4 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center border-b p-5 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Terms of Usage</h2>
            <p className="text-sm text-gray-500 mt-1">Please review and accept our terms to activate your account.</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Decline and Logout"
          >
            <MdClose size={28} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h3>
            <p className="text-gray-600 leading-relaxed">
              By using the Warranty Management System, you agree to comply with all rules and regulations set forth by the administrator. 
              Unauthorized access or use of this system is strictly prohibited.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. Data Privacy</h3>
            <p className="text-gray-600 leading-relaxed">
              Your data is protected under our strict privacy policy. We ensure that your client information and claim details are 
              encrypted and secure. Your information will never be shared with third parties without your explicit consent.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. Usage Responsibilities</h3>
            <p className="text-gray-600 leading-relaxed">
              As a client or user, you are responsible for maintaining the confidentiality of your login credentials and for all 
              activities that occur under your account. You must notify the administrator immediately of any breach of security.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">4. System Integrity</h3>
            <p className="text-gray-600 leading-relaxed">
              Any attempt to misuse, manipulate, or compromise the system's integrity will lead to immediate account suspension 
              and potential legal action.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-2">5. Updates to Terms</h3>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to update these terms at any time. Continued use of the system implies acceptance of the 
              updated terms. We recommend reviewing these terms periodically.
            </p>
          </section>
        </div>
        <div className="p-6 border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-black checked:border-black transition-all"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <svg
                  className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                I have read and accept the terms and conditions
              </span>
            </label>

            <div className="flex gap-3 mt-2">
              <button 
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-white font-bold bg-red-300 hover:bg-red-600 active:bg-red-100 transition-all"
                onClick={handleLogout}
                disabled={isAccepting}
              >
                Logout
              </button>
              <button 
                className={`flex-[2] px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all
                  ${accepted && !isAccepting 
                    ? 'bg-primary hover:bg-primary-dark active:scale-[0.98] shadow-black/20' 
                    : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
                onClick={handleAccept}
                disabled={!accepted || isAccepting}
              >
                {isAccepting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Activating Account...
                  </span>
                ) : 'Accept & Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
