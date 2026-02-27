import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-n-1 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-n-5 hover:text-primary-3 font-medium transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-n-2/30 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold font-sora text-n-8 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-orange max-w-none text-n-5 body-1">
            <p className="mb-6 text-n-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold font-sora text-n-8 mb-4">
                1. Introduction
              </h2>
              <p>
                Welcome to Shopydash ("we," "our," or "us"). We are committed to
                protecting your privacy and ensuring your personal information
                is handled in a safe and responsible manner. This Privacy Policy
                explains how we collect, use, and protect your data when you use
                our mobile application and website services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold font-sora text-n-8 mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information that you provide directly to us:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Account Information:</strong> Name, university email
                  address, phone number, and password when you register.
                </li>
                <li>
                  <strong>Profile Information:</strong> Vendor details, business
                  name, and profile pictures.
                </li>
                <li>
                  <strong>Transaction Data:</strong> Details about payments,
                  products purchased, and order history. Note that we use secure
                  third-party payment processors (Paystack) and do not store
                  your full credit card details.
                </li>
                <li>
                  <strong>User Content:</strong> Products you list for sale,
                  photos, descriptions, reviews, and messages sent through our
                  chat system.
                </li>
                <li>
                  <strong>Lost & Found Reports:</strong> Information regarding
                  lost or found items you submit to the platform.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold font-sora text-n-8 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services.</li>
                <li>
                  Process transactions and send related information, including
                  confirmations and receipts.
                </li>
                <li>Facilitate communication between buyers and sellers.</li>
                <li>
                  Send you technical notices, updates, security alerts, and
                  support messages.
                </li>
                <li>
                  Detect, investigate, and prevent fraudulent transactions and
                  other illegal activities.
                </li>
                <li>
                  Personalize your experience and deliver content relevant to
                  your interests.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold font-sora text-n-8 mb-4">
                4. Location Data
              </h2>
              <p>
                We may request access to your location to help you find vendors
                and products near you or to facilitate delivery. You can control
                location access through your device settings at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold font-sora text-n-8 mb-4">
                5. Data Sharing
              </h2>
              <p>
                We do not sell your personal data. We may share your information
                with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Service Providers:</strong> Vendors, payment
                  processors, and other partners who help us provide our
                  services.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> When required by law or to
                  protect our rights and safety.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold font-sora text-n-8 mb-4">
                6. Data Security
              </h2>
              <p>
                We implement reasonable security measures to protect your
                information. However, no security system is impenetrable and we
                cannot guarantee the absolute security of our systems.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold font-sora text-n-8 mb-4">
                7. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at support@shopydash.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
