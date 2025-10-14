import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import LandingHeader from "../../../components/public/landing-header/landing-header";
import Button from "../../../components/shared/small/landing-Button";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import getEnv from "../../../configs/config";
import { useCreatePaymentIntentMutation } from "../../../redux/apis/paymentApis";

const stripePromise = loadStripe(getEnv("STRIPE_PUBLISH_KEY"));

function CheckoutForm({ email, amount, onClose }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [payProcessing, setPayProcessing] = useState(false);
  const [createPaymentIntent] = useCreatePaymentIntentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPayProcessing(true);
    try {
      const res = await createPaymentIntent({
        email,
        currency: "USD",
        amount,
        paymentType: "donation",
      }).unwrap();

      const { clientSecret } = res;
      const card = elements.getElement(CardElement);

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { email } },
      });

      if (result.error) {
        toast.error(result.error.message);
        setPayProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Thank you for your donation!");
        setPayProcessing(false);
        onClose();
        navigate("/thank-you");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Payment failed. Try again.");
      setPayProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#111827",
                fontWeight: "500",
                fontFamily: "Inter, system-ui, sans-serif",
                "::placeholder": {
                  color: "#6B7280",
                  fontWeight: "400",
                },
              },
              invalid: {
                color: "#EF4444",
                iconColor: "#EF4444",
              },
            },
            hidePostalCode: true,
          }}
          className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        <Button
          variant="outline"
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={payProcessing}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {payProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            `Donate $${amount}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function DonateUs() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [amount, setAmount] = useState(100);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const emailRef = useRef(null);

  const donationInfo = {
    title: "Support Our Mission",
    description:
      "Your contribution helps us grow and make a bigger impact every day.",
    minAmount: 100,
    benefits: [
      "Keep the platform running",
      "Get exclusive updates",
      "Priority support",
      "Recognition on our website",
    ],
  };

  const handleCancel = () => {
    setEmail("");
    setPrivacyPolicy(false);
    setTerms(false);
    setAmount(donationInfo.minAmount);
    toast.success("Form cleared");
  };

  const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);

  const handlePayClick = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (!validateEmail(email)) return toast.error("Please enter a valid email");
    if (!terms) return toast.error("Accept Terms & Conditions to continue");
    if (!privacyPolicy) return toast.error("Accept Privacy Policy to continue");
    if (!amount || amount < donationInfo.minAmount)
      return toast.error(`Minimum donation is $${donationInfo.minAmount}`);
    setShowPaymentModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col max-lg:py-20">
      <LandingHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {/* LEFT */}
          <motion.div
  className="lg:w-1/2 bg-white rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col justify-between relative overflow-hidden group"
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 200, damping: 15 }}
>
  <div className="absolute top-0 right-0 w-36 h-36 bg-[#0b5c83]/10 rounded-full -translate-y-16 translate-x-16 blur-2xl scale-125 group-hover:scale-150 transition-transform duration-500"></div>
  <div className="absolute bottom-0 left-0 w-28 h-28 bg-indigo-500/10 rounded-full translate-y-12 -translate-x-12 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>

  <div className="relative z-10 flex flex-col items-center text-center">
    <motion.div
      initial={{ rotate: 0, scale: 1, y: 0 }}
      whileHover={{ rotate: 10, scale: 1.25, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative w-20 h-20 flex items-center justify-center mb-5"
    >
      <div className="absolute inset-0 bg-gradient-to-tr rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
      <div className="bg-[#0b5c83]/10 text-[#0b5c83] rounded-full p-5 shadow-lg relative z-10">
        <FontAwesomeIcon icon={faHandHoldingDollar} className="text-3xl" />
      </div>
    </motion.div>

    <div className="flex flex-col gap-4 justify-between items-center w-full mb-6">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
        {donationInfo.title}
      </h3>
      <span className="bg-[#0b5c83]/10 text-[#0b5c83] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        MIN ${donationInfo.minAmount}
      </span>
    </div>

    <p className="text-gray-600 mb-8 leading-relaxed">
      {donationInfo.description}
    </p>

    <div className="space-y-4 w-full text-left">
      <h4 className="font-semibold text-gray-900 text-lg">
        What your donation supports:
      </h4>
      <ul className="space-y-3">
        {donationInfo.benefits.map((b, i) => (
          <li key={i} className="flex items-center gap-3 text-gray-700 group/item">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-[#0b5c83] rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <span className="group-hover/item:text-gray-900 transition-colors duration-300">
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</motion.div>



          {/* RIGHT */}
          <motion.div
            className="lg:w-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
            whileHover={{ scale: 1.01 }}
          >
            <div className="mb-8 text-center lg:text-left">
              <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Make a Donation
              </h4>
              <p className="text-gray-600">
                Enter your details to support our mission
              </p>
            </div>

            <form onSubmit={handlePayClick} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    ref={emailRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {email && validateEmail(email) && (
                      <svg
                        className="w-5 h-5 text-[#0b5c83]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Donation Amount ($)
                </label>
                <input
                  type="number"
                  id="amount"
                  min={donationInfo.minAmount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="block w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-[#0b5c83]/5 rounded-xl border border-[#0b5c83]/20">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="w-5 h-5 mt-1 accent-[#0b5c83] rounded focus:ring-[#0b5c83] flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a
                      href="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0b5c83] font-semibold hover:underline"
                    >
                      Terms & Conditions
                    </a>
                  </label>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-[#0b5c83]/5 rounded-xl border border-[#0b5c83]/20">
                  <input
                    id="privacyPolicy"
                    type="checkbox"
                    checked={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.checked)}
                    className="w-5 h-5 mt-1 accent-[#0b5c83] rounded focus:ring-[#0b5c83] flex-shrink-0"
                  />
                  <label
                    htmlFor="privacyPolicy"
                    className="text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0b5c83] font-semibold hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 font-semibold rounded-xl transition-all duration-200"
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !(email && validateEmail(email) && terms && privacyPolicy)
                  }
                  className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl transition-all duration-200 ${
                    email && validateEmail(email) && terms && privacyPolicy
                      ? "bg-gradient-to-r from-[#0b5c83] to-[#0b5c83] hover:from-[#0b5c83] hover:to-[#0b5c83] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Donate ${amount}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPaymentModal(false)}
            ></div>

            <motion.div
              className="bg-white rounded-3xl w-full max-w-md mx-auto relative z-10 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="bg-gradient-to-r from-[#0b5c83] to-[#0b5c83] p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold">Complete Your Donation</h4>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-[#0b5c83]">
                  You're almost there! Just enter your card details
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Donation Amount
                    </p>
                    <p className="text-sm text-gray-500">One-time payment</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${amount}
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    email={email}
                    amount={amount}
                    onClose={() => setShowPaymentModal(false)}
                  />
                </Elements>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Your payment is secure and encrypted. We never store your
                    card details.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
