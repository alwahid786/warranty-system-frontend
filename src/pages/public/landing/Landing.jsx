import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/shared/small/landing-Button.jsx";
import { Card, CardContent } from "../../../components/shared/small/card.jsx";
import getEnv from "../../../configs/config.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faFileInvoiceDollar,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import landingHeader from "../../../components/public/landing-header/landing-header.jsx";

const LandingPage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Membership",
      desc: "Become a verified member to manage claims and access dashboard.",
      icon: faUsers,
    },
    {
      title: "Claims Management",
      desc: "Clients can submit claims, and admins can approve or reject them easily.",
      icon: faClipboardCheck,
    },
    {
      title: "Invoice System",
      desc: "Automatic invoice generation after claim approval with admin notifications.",
      icon: faFileInvoiceDollar,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      {landingHeader()}

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-10 mt-24">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
          {/* Left Logo Area */}
          <motion.img
            src={getEnv("LOGO_URL_WITH_BACKGROUND")}
            alt="Company Logo"
            className="w-64 h-64 object-contain"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* Right Text Area */}
          <motion.div
            className="text-center md:text-left md:w-1/2 space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-[rgb(11,92,131)]">
              Simplify Your Claims Management
            </h2>
            <p className="text-gray-600 text-lg">
              National Warranty System helps clients file claims and receive
              approvals faster. Admins can manage claims, send invoices, and
              monitor performance—all in one place.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="bg-[rgb(11,92,131)] text-white font-semibold hover:bg-[rgb(9,70,100)]"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h3 className="text-3xl font-bold text-[rgb(11,92,131)] mb-3">
            What We Offer
          </h3>
          <p className="text-gray-600">
            Explore how National Warranty System simplifies the workflow for
            clients and admins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Card className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <CardContent className="p-6 space-y-3">
                  <FontAwesomeIcon
                    className="text-4xl text-[rgb(11,92,131)]"
                    icon={card.icon}
                  />
                  <h4 className="text-xl font-semibold text-[rgb(11,92,131)]">
                    {card.title}
                  </h4>
                  <p className="text-gray-600">{card.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[rgb(11,92,131)] text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} National Warranty System. All Rights
        Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
