import React, { useState } from 'react';
import { useAcceptTermsMutation, useLogoutMutation } from '../../redux/apis/authApis';
import toast from 'react-hot-toast';

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
    <div className="terms-modal-overlay">
      <div className="terms-modal-container">
        <div className="terms-modal-header">
          <h2>Terms of Usage</h2>
          <p>Please review and accept our terms to activate your account.</p>
        </div>
        
        <div className="terms-modal-content">
          <h3>1. Acceptance of Terms</h3>
          <p>By using the Warranty Management System, you agree to comply with all rules and regulations set forth by the administrator.</p>
          
          <h3>2. Data Privacy</h3>
          <p>Your data is protected under our strict privacy policy. We ensure that your client information and claim details are encrypted and secure.</p>
          
          <h3>3. Usage Responsibilities</h3>
          <p>As a client or user, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
          
          <h3>4. System Integrity</h3>
          <p>Any attempt to misuse, manipulate, or compromise the system's integrity will lead to immediate account suspension.</p>

          <h3>5. Updates to Terms</h3>
          <p>We reserve the right to update these terms at any time. Continued use of the system implies acceptance of the updated terms.</p>
        </div>

        <div className="terms-modal-actions">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span className="checkmark"></span>
            I accept the terms and conditions
          </label>

          <div className="button-group">
            <button 
              className="btn-decline" 
              onClick={handleLogout}
              disabled={isAccepting}
            >
              Logout
            </button>
            <button 
              className="btn-accept" 
              onClick={handleAccept}
              disabled={!accepted || isAccepting}
            >
              {isAccepting ? 'Activating...' : 'Accept & Continue'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .terms-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }

        .terms-modal-container {
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.4s ease-out;
          overflow: hidden;
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .terms-modal-header {
          padding: 30px;
          border-bottom: 1px solid #eee;
          background: linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%);
          color: white;
        }

        .terms-modal-header h2 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .terms-modal-header p {
          margin: 10px 0 0;
          opacity: 0.8;
          font-size: 0.95rem;
        }

        .terms-modal-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          color: #444;
          line-height: 1.6;
          background: #f9f9f9;
        }

        .terms-modal-content h3 {
          color: #1a1a1a;
          font-size: 1.1rem;
          margin-top: 20px;
          margin-bottom: 10px;
        }

        .terms-modal-content p {
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .terms-modal-actions {
          padding: 30px;
          border-top: 1px solid #eee;
          background: white;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 1rem;
          color: #1a1a1a;
          margin-bottom: 25px;
          user-select: none;
        }

        .checkbox-container input {
          margin-right: 12px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #000;
        }

        .button-group {
          display: flex;
          gap: 15px;
        }

        .btn-accept {
          flex: 1;
          background: #1a1a1a;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-accept:hover:not(:disabled) {
          background: #000;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
        }

        .btn-accept:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-decline {
          padding: 14px 25px;
          background: white;
          color: #ff4444;
          border: 2px solid #ff4444;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-decline:hover {
          background: #fff5f5;
        }
      `}</style>
    </div>
  );
};

export default TermsModal;
