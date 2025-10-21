import React from "react";
import LandingHeader from "../../../components/public/landing-header/landing-header";
import getEnv from "../../../configs/config";

function TermsAndConditions() {
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
          Terms of Service (TOS)
        </h1>

        <div className="prose max-w-3xl mx-auto text-gray-700 leading-relaxed relative z-10">
          <section className="space-y-6">
            <p className="text-lg font-semibold">Global Learning Bridge</p>
            <p>
              Global Learning Bridge is an international charitable initiative
              that builds desks for primary schools in developing countries and
              provides other school supplies. These Terms govern your use of our
              website, member area, blog/discussion features, media galleries,
              and donation tools (together, the “Services”).
            </p>
            <p>
              By using the Services, creating an account, posting in the blog,
              or making a donation, you agree to this TOS and our Privacy Policy
              (
              <span className="text-blue-600 underline cursor-pointer">
                [link]
              </span>
              ). If you don’t agree, please don’t use the Services.
            </p>
          </section>

          <hr className="my-8" />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              1. Eligibility & Accounts
            </h2>
            <p>
              You must be at least 13 years old (or the age of digital consent
              in your country). If you’re under 18, you confirm you have
              parent/guardian consent.
            </p>
            <p>
              Keep your login credentials secure — you’re responsible for all
              activity on your account. We may suspend or terminate accounts
              that violate this TOS or our Community Standards (Section 6).
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              2. Donations (Non-Refundable) & Receipts
            </h2>
            <p>
              All donations are nonrefundable. By donating, you acknowledge we
              may deploy funds where needs are greatest, including project,
              administrative, and compliance costs.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Receipts:</strong> You will receive a donation receipt
                by email. You can request a copy later using our Contact page.
              </li>
              <li>
                <strong>Errors & fraud:</strong> Corrections for processing
                errors, duplicates, or unauthorized payments may be considered
                within 30 days.
              </li>
              <li>
                <strong>Recurring donations:</strong> You can cancel future
                charges anytime via your account or by contacting us.
              </li>
              <li>
                <strong>Tax status:</strong> Deductibility depends on your
                jurisdiction and our charitable status. We don’t provide tax
                advice; consult your advisor.
              </li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              3. Payments & Third-Party Processors
            </h2>
            <p>
              We use trusted third-party payment processors (e.g., card
              networks, bank transfers, digital wallets). Your payments are
              subject to their terms, privacy practices, and fees. We don’t
              store full card numbers.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              4. Transparency & Financial Statements
            </h2>
            <p>
              We publish financial statements, budgets, and impact reports on
              our Transparency page. These may be unaudited, for informational
              purposes, and subject to updates. Publication does not constitute
              investment, legal, or tax advice.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">5. Community Standards</h2>
            <p>
              To maintain a positive environment, you agree to follow these
              standards when posting or interacting:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Be on-topic and respectful; no harassment or hate speech.</li>
              <li>No profanity, spam, misinformation, or solicitation.</li>
              <li>Protect privacy — no doxxing or posting personal data.</li>
              <li>
                No exploitative or explicit content, especially involving
                minors.
              </li>
              <li>
                We reserve the right to remove content or suspend accounts
                violating these rules.
              </li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              6. Your Content (User-Generated Content)
            </h2>
            <p>
              You retain ownership of any content you post but grant us a
              nonexclusive, royalty-free, worldwide license to use, display, and
              distribute it for operating and promoting our services.
            </p>
            <p>
              You warrant that your content doesn’t infringe others’ rights.
              Feedback and ideas you share may be used by us without obligation.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              7. Our Content & Intellectual Property
            </h2>
            <p>
              All site materials, design, and code are owned by us or our
              licensors. You may share public pages for noncommercial purposes
              with attribution. No scraping, copying, or derivative works
              without written permission.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              8. Photos/Videos, Safeguarding & Consent
            </h2>
            <p>
              We do not accept or publish images of children taken without
              proper consent. If you upload media, ensure you have obtained all
              necessary permissions and removed identifying metadata. We may
              edit or decline media to protect privacy and safety.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">9. Prohibited Uses</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li>Breaking laws or infringing IP rights</li>
              <li>Introducing malware or security exploits</li>
              <li>Impersonation or disruptive bots</li>
              <li>Collecting user data without consent</li>
              <li>Political campaigning or partisan activity</li>
            </ul>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              10. International Use, Sanctions & Compliance
            </h2>
            <p>
              We comply with global AML, anticorruption, and sanctions laws. We
              may decline or refund donations conflicting with these obligations
              and may request verification of identity or funding source if
              required.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">11. Privacy</h2>
            <p>
              Your use of our Services is also governed by our Privacy Policy (
              <span className="text-blue-600 underline cursor-pointer">
                [link]
              </span>
              ). It explains what we collect, how we use it, and your choices
              regarding cookies, consent, and data transfers.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              12. Service Changes & Availability
            </h2>
            <p>
              We may add, modify, or remove features from time to time. While we
              strive to ensure uptime, we can’t guarantee uninterrupted service.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">13. Disclaimers</h2>
            <p>
              Our Services and materials are provided “as is.” We make no
              warranties regarding accuracy or suitability. Project timelines
              and outcomes may change due to real-world conditions.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              14. Limitation of Liability
            </h2>
            <p>
              To the maximum extent allowed by law, we are not liable for
              indirect, incidental, or consequential damages. Our total
              liability for any claim is limited to the amount you donated in
              the 12 months before the claim.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">15. Indemnity</h2>
            <p>
              You agree to indemnify and hold harmless Global Learning Bridge,
              its officers, employees, and volunteers from any claims arising
              from your content, use of services, or violation of these terms.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">16. Termination</h2>
            <p>
              You may delete your account anytime. We may suspend or terminate
              access for violations or misuse. Sections 7–8, 11, 14–17 survive
              termination.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">
              17. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of South Carolina, USA. Any
              disputes shall be resolved in the courts of Charleston County,
              South Carolina.
            </p>
            <p>
              Optional arbitration clause: Disputes may alternatively be
              resolved via individual binding arbitration under applicable
              rules, with no class actions permitted.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">18. Changes to this TOS</h2>
            <p>
              We may update these Terms from time to time. The update date will
              be posted, and continued use of the Services indicates your
              acceptance of the revised Terms.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}

export default TermsAndConditions;
