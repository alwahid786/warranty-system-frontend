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
      console.error(err);
      toast.error(err?.data?.message || "Payment failed. Try again.");
      setPayProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#111",
              "::placeholder": { color: "#888" },
            },
            invalid: { color: "#fa755a" },
          },
        }}
      />
      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={payProcessing}>
          {payProcessing ? "Processing..." : `Donate $${amount}`}
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
    title: "Donate Us",
    description: "Support our mission with your contribution.",
    minAmount: 100,
    benefits: [
      "Support platform maintenance",
      "Access exclusive updates",
      "Priority community support",
      "Recognition on website",
    ],
  };

  const handleCancel = () => {
    setEmail("");
    setPrivacyPolicy(false);
    setTerms(false);
    setAmount(donationInfo.minAmount);
    setShowPassword(false);
    toast.success("Form cleared");
  };

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handlePayClick = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email");
    if (!validateEmail(email)) return toast.error("Please enter a valid email");

    if (!terms) return toast.error("Accept Terms & Conditions to continue");
    if (!privacyPolicy) return toast.error("Accept Privacy Policy to continue");
    if (!amount || amount < donationInfo.minAmount)
      return toast.error(`Minimum donation is $${donationInfo.minAmount}`);

    setShowPaymentModal(true);
  };

  const leftVariants = {
    hidden: { x: -80, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };
  const rightVariants = {
    hidden: { x: 80, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LandingHeader />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row items-stretch">
            {/* LEFT - Form Card (70%) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={leftVariants}
              transition={{ duration: 0.6 }}
              className="md:flex-1"
              style={{ flexBasis: "70%" }}
            >
              <div className="h-full bg-white rounded-l-2xl shadow-lg border border-[rgba(11,92,131,0.06)] p-8">
                <h4 className="text-xl font-semibold text-[rgb(11,92,131)] mb-4">
                  Donate & Support Us
                </h4>

                <form onSubmit={handlePayClick} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      ref={emailRef}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(11,92,131)]"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Donation Amount (min ${donationInfo.minAmount})
                    </label>
                    <input
                      id="amount"
                      type="number"
                      value={amount}
                      min={donationInfo.minAmount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(11,92,131)]"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="w-4 h-4 accent-[rgb(11,92,131)]"
                    />
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the{" "}
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[rgb(11,92,131)] hover:underline font-medium"
                      >
                        Terms & Conditions
                      </a>
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <input
                      id="privacyPolicy"
                      type="checkbox"
                      checked={privacyPolicy}
                      onChange={(e) => setPrivacyPolicy(e.target.checked)}
                      className="w-4 h-4 accent-[rgb(11,92,131)]"
                    />
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[rgb(11,92,131)] hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="bg-[rgb(11,92,131)] text-white border border-[rgb(11,92,131)] hover:bg-[rgb(56,122,155)] hover:text-white transition-colors duration-200 rounded-md px-4 py-2 font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`rounded-md px-4 py-2 font-semibold ${
                        email &&
                        validateEmail(email) &&
                        terms &&
                        privacyPolicy &&
                        amount >= donationInfo.minAmount
                          ? "bg-[rgb(11,92,131)] text-white hover:bg-[rgb(8,78,110)]"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={
                        !(
                          email &&
                          validateEmail(email) &&
                          terms &&
                          privacyPolicy &&
                          amount >= donationInfo.minAmount
                        )
                      }
                    >
                      {`Donate — $${amount}`}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* RIGHT - Info Card (30%) */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={rightVariants}
              transition={{ duration: 0.6 }}
              className="md:flex-shrink-0"
              style={{ flexBasis: "30%" }}
            >
              <div className="h-full bg-white rounded-r-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between items-center text-center">
                <FontAwesomeIcon
                  icon={faHandHoldingDollar}
                  size="3x"
                  className="text-[rgb(11,92,131)] mb-4"
                />
                <h3 className="text-2xl font-bold text-[rgb(11,92,131)]">
                  {donationInfo.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {donationInfo.description}
                </p>
                <ul className="mt-6 space-y-2 text-gray-700 text-left w-full">
                  {donationInfo.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[rgb(11,92,131)]">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stripe Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-md p-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <h4 className="text-lg font-semibold text-[rgb(11,92,131)] mb-4">
                Donate ${amount} — Card Payment
              </h4>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  email={email}
                  amount={amount}
                  onClose={() => setShowPaymentModal(false)}
                />
              </Elements>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
