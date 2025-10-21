import React from "react";
import LandingHeader from "../../../components/public/landing-header/landing-header";
import getEnv from "../../../configs/config";

function PrivacyPolicy() {
  return (
    <>
      <LandingHeader />
      <section className="relative min-h-screen bg-white mt-8 py-16 px-6 md:px-20 overflow-hidden">
        {/* Light background logo */}
        <img
          src={getEnv("LOGO_URL_WITH_BACKGROUND")}
          alt="Precision Warranty Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 w-[400px] md:w-[600px] select-none pointer-events-none"
        />

        <h1 className="text-3xl font-bold text-center mb-8 relative z-10">
          Privacy Policy
        </h1>

        <div className="prose max-w-3xl mx-auto text-gray-700 leading-relaxed relative z-10">
          {/* Privacy policy content */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              Our Commitment to Privacy
            </h2>
            <p>
              Global Learning Bridge respects your privacy and is committed to
              protecting your personal information. We uphold transparency,
              accountability, and choice in how your data is collected and used.
              By using our website and services, you agree to the terms outlined
              in this Privacy Policy and our Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              Information We Collect
            </h2>
            <p>
              We collect personal information that you voluntarily provide, such
              as your name, email address, phone number, and mailing address
              when you donate, purchase products, contact us, or apply for
              employment. We may also collect data automatically through
              technologies like cookies, web server logs, pixel tags, and social
              media widgets to enhance your browsing experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              How We Store Information
            </h2>
            <p>
              Your information is stored securely while your account remains
              active or as long as necessary to provide our services. You may
              request to cancel your account or restrict data usage by
              contacting us. We may retain certain information as required to
              meet legal obligations, resolve disputes, or enforce agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Information Sharing</h2>
            <p>
              We do not rent or sell your personal information. We may share it
              only in the following cases:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>When legally required by law or regulation</li>
              <li>With trusted service providers acting on our behalf</li>
              <li>With successor entities in case of organizational changes</li>
              <li>With your explicit consent or permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p>
              You have the right to view, correct, or delete your personal data.
              You may also file a privacy-related complaint or data access
              request by contacting us through our Contact Us page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Terms of Service</h2>
            <p>
              By using our site, you agree to comply with applicable laws and
              these terms. We are not responsible for content posted by users.
              You agree to indemnify Global Learning Bridge and its affiliates
              against any losses or legal fees resulting from misuse of our site
              or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Copyright</h2>
            <p>
              All content on this site is the exclusive property of Global
              Learning Bridge and is protected by U.S. and international
              copyright laws. Unauthorized reproduction or distribution of site
              materials is strictly prohibited.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicy;
