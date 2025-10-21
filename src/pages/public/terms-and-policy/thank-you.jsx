import React from "react";
import { useNavigate } from "react-router-dom";

function ThankYouPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[rgb(200,230,245)] via-[rgb(180,220,240)] to-[rgb(220,240,250)] text-center px-6">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full backdrop-blur-sm bg-opacity-90">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-[rgb(11,92,131)] mb-4">
          Thank You for Your Generosity!
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Your donation helps us continue building innovative solutions that
          make a difference. We truly appreciate your support and belief in our
          mission.
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-[rgb(11,92,131)] hover:bg-[rgb(39,124,167)] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200"
        >
          Get Started
        </button>
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} Precision Warranty Services. All rights
        reserved.
      </footer>
    </div>
  );
}

export default ThankYouPage;
