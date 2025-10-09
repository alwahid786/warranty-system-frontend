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
          {payProcessing ? "Processing..." : `Donate $${plan.price}`}
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
    name: "Monthly Membership",
    price: 100,
    currency: "USD",
    description: "Billed monthly. Cancel anytime.",
    benefits: [
      "Member dashboard access",
      "Priority claim approvals",
      "Automated invoices",
      "Dedicated support",
    ],
  };

  const handleCancel = () => {
    setEmail("");
    setPrivacyPolicy(false);
    setTerms(false);
    toast.success("Form cleared");
  };

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handlePayClick = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    if (!validateEmail(email)) return toast.error("Please enter a valid email");
    if (!terms) return toast.error("Accept Terms & Conditions to continue");
    if (!privacyPolicy) return toast.error("Accept Privacy Policy to continue");

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
            {/* LEFT - Plan card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={leftVariants}
              transition={{ duration: 0.6 }}
              className="md:flex-shrink-0"
              style={{ flexBasis: "30%" }}
            >
              <div className="h-full bg-white rounded-l-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[rgb(11,92,131)]">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {plan.description}
                  </p>
                  <div className="mt-6 text-[rgb(11,92,131)] text-4xl font-extrabold">
                    ${plan.price}
                    <span className="text-base text-gray-500 font-medium">
                      /month
                    </span>
                  </div>
                  <ul className="mt-6 space-y-2">
                    {plan.benefits.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="text-[rgb(11,92,131)]">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* RIGHT - Form card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={rightVariants}
              transition={{ duration: 0.6 }}
              className="md:flex-1"
              style={{ flexBasis: "70%" }}
            >
              <div className="h-full bg-white rounded-r-2xl shadow-lg border border-[rgba(11,92,131,0.06)] p-8">
                <h4 className="text-xl font-semibold text-[rgb(11,92,131)] mb-4">
                  Join — Quick Signup
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
                        email && validateEmail(email) && terms && privacyPolicy
                          ? "bg-[rgb(11,92,131)] text-white hover:bg-[rgb(8,78,110)]"
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
                      Pay to Become Member — ${plan.price}
                    </Button>
                  </div>
                </form>
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
                Pay ${plan.price} — Card Payment
              </h4>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  email={email}
                  plan={plan}
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
