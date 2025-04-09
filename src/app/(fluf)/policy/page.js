import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <main className="font-sans">
      
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            nexus
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="text-gray-600 hover:text-black flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </nav>

      
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 mb-4">
              At Nexus, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our platform. Please read this privacy
              policy carefully. If you do not agree with the terms of this
              privacy policy, please do not access the application.
            </p>
            <p className="text-gray-700">
              We reserve the right to make changes to this Privacy Policy at any
              time and for any reason. We will alert you about any changes by
              updating the "Last updated" date of this Privacy Policy. You are
              encouraged to periodically review this Privacy Policy to stay
              informed of updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              2. Collection of Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may collect information about you in a variety of ways. The
              information we may collect via the Application includes:
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">Personal Data</h3>
            <p className="text-gray-700 mb-4">
              Personally identifiable information, such as your name, email
              address, and telephone number, that you voluntarily give to us
              when you register with the Application or when you choose to
              participate in various activities related to the Application.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">Derivative Data</h3>
            <p className="text-gray-700 mb-4">
              Information our servers automatically collect when you access the
              Application, such as your IP address, browser type, operating
              system, access times, and the pages you have viewed directly
              before and after accessing the Application.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">Financial Data</h3>
            <p className="text-gray-700 mb-4">
              Financial information, such as data related to your payment method
              (e.g., valid credit card number, card brand, expiration date) that
              we may collect when you purchase, order, return, exchange, or
              request information about our services from the Application.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">Mobile Device Data</h3>
            <p className="text-gray-700">
              Device information, such as your mobile device ID, model, and
              manufacturer, and information about the location of your device,
              if you access the Application from a mobile device.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              3. Use of Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Application to:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Create and manage your account.</li>
              <li>Process transactions.</li>
              <li>Provide you with relevant content and services.</li>
              <li>Email you regarding your account or order.</li>
              <li>
                Fulfill and manage purchases, orders, payments, and other
                transactions related to the Application.
              </li>
              <li>
                Monitor and analyze usage and trends to improve the Application.
              </li>
              <li>Notify you of updates to the Application.</li>
              <li>
                Offer new products, services, and/or recommendations to you.
              </li>
              <li>Perform other business activities as needed.</li>
              <li>
                Request feedback and contact you about your use of the
                Application.
              </li>
              <li>Resolve disputes and troubleshoot problems.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              4. Disclosure of Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We may share information we have collected about you in certain
              situations. Your information may be disclosed as follows:
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">
              By Law or to Protect Rights
            </h3>
            <p className="text-gray-700 mb-4">
              If we believe the release of information about you is necessary to
              respond to legal process, to investigate or remedy potential
              violations of our policies, or to protect the rights, property,
              and safety of others, we may share your information as permitted
              or required by any applicable law, rule, or regulation.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">
              Third-Party Service Providers
            </h3>
            <p className="text-gray-700 mb-4">
              We may share your information with third parties that perform
              services for us or on our behalf, including payment processing,
              data analysis, email delivery, hosting services, customer service,
              and marketing assistance.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">
              Marketing Communications
            </h3>
            <p className="text-gray-700">
              With your consent, or with an opportunity for you to withdraw
              consent, we may share your information with third parties for
              marketing purposes, as permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              5. Contact Us
            </h2>
            <p className="text-gray-700">
              If you have questions or comments about this Privacy Policy,
              please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="font-medium">Nexus, Inc.</p>
              <p className="text-gray-700">123 Tech Street</p>
              <p className="text-gray-700">San Francisco, CA 94105</p>
              <p className="text-gray-700">Email: privacy@nexus.com</p>
              <p className="text-gray-700">Phone: (555) 123-4567</p>
            </div>
          </section>
        </div>
      </div>

      
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">
                © 2025 Nexus, Inc. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-black font-bold"
              >
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-black">
                Terms
              </Link>
              <Link href="/security" className="text-gray-500 hover:text-black">
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
