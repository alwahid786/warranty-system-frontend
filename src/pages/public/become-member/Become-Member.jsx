import React, { useRef, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
import getEnv from "../../../configs/config";
import { useCreatePaymentIntentMutation } from "../../../redux/apis/paymentApis";

const stripePromise = loadStripe(getEnv("STRIPE_PUBLISH_KEY"));

function CheckoutForm({ email, plan, onClose }) {
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
        currency: plan.currency,
        amount: plan.price,
        paymentType: "membership",
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
        toast.success("Payment successful! Membership activated.");
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
      <div className="bg-gradient-to-r from-[#0b5c83]/5 to-[#0b5c83]/10 p-4 rounded-xl border border-[#0b5c83]/20">
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
          className="w-full sm:w-auto px-6 py-3 bg-[#0b5c83] hover:bg-[#0b5c83]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {payProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            `Pay $${plan.price}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function BecomeMember() {
  const [email, setEmail] = useState("");
  const [terms, setTerms] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const emailRef = useRef(null);

  const plan = {
    name: "Premium Membership",
    price: 100,
    currency: "USD",
    description:
      "Unlock exclusive features and join a growing network of professionals.",
    benefits: [
      "Full dashboard access",
      "Priority claim approvals",
      "Automated monthly invoices",
      "Dedicated support team",
      "Early access to new features",
      "Member-only resources",
    ],
  };

  const validateEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const handleCancel = () => {
    setEmail("");
    setPrivacyPolicy(false);
    setTerms(false);
    toast.success("Form cleared");
  };
  const handlePayClick = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (!validateEmail(email)) return toast.error("Please enter a valid email");
    if (!terms) return toast.error("Accept Terms & Conditions to continue");
    if (!privacyPolicy) return toast.error("Accept Privacy Policy to continue");
    setShowPaymentModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const cardHoverVariants = {
    rest: {
      scale: 1,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.03,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05)",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#0b5c83]/5 to-[#0b5c83]/10 flex flex-col max-lg:py-20">
      <LandingHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <Motion.div
          className="w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
            <Motion.div
              variants={itemVariants}
              className="lg:w-1/3"
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              <Motion.div
                variants={cardHoverVariants}
                className="h-full bg-white rounded-2xl shadow-xl border border-[#0b5c83]/20 p-8 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0b5c83]/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0b5c83]/5 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <span className="bg-[#0b5c83]/10 text-[#0b5c83] text-xs font-semibold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      No hidden fees · Cancel anytime
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">
                      What's included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.benefits.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-gray-700 group"
                        >
                          <div className="w-6 h-6 bg-[#0b5c83] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <svg
                              className="w-3 h-3 text-white"
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
                          </div>
                          <span className="group-hover:text-gray-900 transition-colors duration-200">
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Motion.div>
            </Motion.div>

            <Motion.div variants={itemVariants} className="lg:flex-1">
              <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="mb-8 text-center lg:text-left">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Start Your Journey
                  </h4>
                  <p className="text-gray-600">
                    Enter your details to join our premium membership
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
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0b5c83] transition-all"
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
                      className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl transition-all duration-200
                     ${
                       email && validateEmail(email) && terms && privacyPolicy
                         ? "bg-[#0b5c83] text-white shadow-lg hover:bg-[#0b5c83]/90 hover:shadow-xl hover:-translate-y-0.5"
                         : "bg-gray-200 text-gray-400 cursor-not-allowed"
                     }`}
                      disabled={
                        !(
                          email &&
                          validateEmail(email) &&
                          terms &&
                          privacyPolicy
                        )
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Become Member</span>
                        <span className="text-lg">—</span>
                        <span>${plan.price}</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                    </Button>
                  </div>
                </form>
              </div>
            </Motion.div>
          </div>
        </Motion.div>
      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPaymentModal(false)}
            ></div>

            <Motion.div
              className="bg-white rounded-3xl w-full max-w-md mx-auto relative z-10 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="bg-[#0b5c83] p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold">Complete Your Payment</h4>
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
                <p className="text-blue-100">
                  You're almost there! Just enter your card details
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">{plan.name}</p>
                    <p className="text-sm text-gray-500">One-time payment</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${plan.price}
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    email={email}
                    plan={plan}
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
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
