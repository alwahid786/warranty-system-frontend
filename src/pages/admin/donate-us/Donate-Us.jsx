import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/shared/small/landing-Button";
import getEnv from "../../../configs/config";
import { useCreatePaymentIntentMutation } from "../../../redux/apis/paymentApis";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const stripePromise = loadStripe(getEnv("STRIPE_PUBLISH_KEY"));

// -------------------- Checkout Form --------------------
function CheckoutForm({ email, amount, onClose }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

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
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Thank you for your donation!");
        setLoading(false);
        onClose();
        navigate("/thank-you");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Payment failed. Try again.");
      setLoading(false);
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
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : `Donate $${amount}`}
        </Button>
      </div>
    </form>
  );
}

// -------------------- Dashboard Donate Page --------------------
export default function DonateDashboard() {
  const [amount, setAmount] = useState(100);
  const [terms, setTerms] = useState(false);
  const [policy, setPolicy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const validateEmail = (val) => /\S+@\S+\.\S+/.test(val);

  const handleDonate = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    if (!validateEmail(email)) return toast.error("Invalid email");
    if (!terms) return toast.error("Accept Terms & Conditions");
    if (!policy) return toast.error("Accept Privacy Policy");
    if (amount < 1) return toast.error("Enter a valid amount");

    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      {/* Top Section */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <FontAwesomeIcon
          icon={faHeartCircleCheck}
          size="4x"
          className="text-[rgb(11,92,131)] mb-4"
        />
        <h2 className="text-3xl font-bold text-[rgb(11,92,131)] mb-2">
          Make a Difference Today
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your contribution helps us continue our mission to create impact and
          support communities in need.
        </p>
      </motion.div>

      {/* Donation Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg p-8"
      >
        <h4 className="text-xl font-semibold text-[rgb(11,92,131)] mb-4">
          Donate via Dashboard
        </h4>

        <form onSubmit={handleDonate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Donation Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              min={1}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[rgb(11,92,131)] outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="w-4 h-4 accent-[rgb(11,92,131)]"
            />
            <label>
              I agree to the{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                className="text-[rgb(11,92,131)] font-medium hover:underline"
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={policy}
              onChange={(e) => setPolicy(e.target.checked)}
              className="w-4 h-4 accent-[rgb(11,92,131)]"
            />
            <label>
              I agree to the{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                className="text-[rgb(11,92,131)] font-medium hover:underline"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={!email || !terms || !policy || amount < 1}
            className={`w-full py-2 rounded-md font-semibold ${
              email && terms && policy && amount >= 1
                ? "bg-[rgb(11,92,131)] text-white hover:bg-[rgb(8,78,110)]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Donate ${amount}
          </Button>
        </form>
      </motion.div>

      {/* Stripe Modal */}
      <AnimatePresence>
        {showModal && (
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
                  onClose={() => setShowModal(false)}
                />
              </Elements>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
