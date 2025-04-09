import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">
          Terms of Service
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service constitute a legally binding agreement made
              between you and Nexus, Inc., concerning your access to and use of
              the Nexus platform. You agree that by accessing the platform, you
              have read, understood, and agree to be bound by all of these Terms
              of Service.
            </p>
            <p className="text-gray-700">
              If you do not agree with all of these Terms of Service, then you
              are expressly prohibited from using the platform and you must
              discontinue use immediately. We reserve the right, in our sole
              discretion, to make changes or modifications to these Terms of
              Service at any time and for any reason.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              2. User Representations
            </h2>
            <p className="text-gray-700 mb-4">
              By using the platform, you represent and warrant that:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                All registration information you submit will be true, accurate,
                current, and complete.
              </li>
              <li>
                You will maintain the accuracy of such information and promptly
                update such registration information as necessary.
              </li>
              <li>
                You have the legal capacity and you agree to comply with these
                Terms of Service.
              </li>
              <li>
                You are not a minor in the jurisdiction in which you reside, or
                if a minor, you have received parental permission to use the
                platform.
              </li>
              <li>
                You will not access the platform through automated or non-human
                means, whether through a bot, script, or otherwise.
              </li>
              <li>
                You will not use the platform for any illegal or unauthorized
                purpose.
              </li>
              <li>
                Your use of the platform will not violate any applicable law or
                regulation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              3. User Registration
            </h2>
            <p className="text-gray-700 mb-4">
              You may be required to register with the platform. You agree to
              keep your password confidential and will be responsible for all
              use of your account and password. We reserve the right to remove,
              reclaim, or change a username you select if we determine, in our
              sole discretion, that such username is inappropriate, obscene, or
              otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              4. Fees and Payment
            </h2>
            <p className="text-gray-700 mb-4">
              We accept the following forms of payment:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Visa</li>
              <li>Mastercard</li>
              <li>American Express</li>
              <li>PayPal</li>
            </ul>

            <p className="text-gray-700 mt-4">
              You may be required to purchase or pay a fee to access some of our
              services. You agree to provide current, complete, and accurate
              purchase and account information for all purchases made via the
              platform. You further agree to promptly update account and payment
              information, including email address, payment method, and payment
              card expiration date, so that we can complete your transactions
              and contact you as needed.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              5. Prohibited Activities
            </h2>
            <p className="text-gray-700 mb-4">
              You may not access or use the platform for any purpose other than
              that for which we make the platform available. The platform may
              not be used in connection with any commercial endeavors except
              those that are specifically endorsed or approved by us.
            </p>

            <p className="text-gray-700 mb-4">
              As a user of the platform, you agree not to:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Systematically retrieve data or other content from the platform
                to create or compile, directly or indirectly, a collection,
                compilation, database, or directory without written permission
                from us.
              </li>
              <li>
                Trick, defraud, or mislead us and other users, especially in any
                attempt to learn sensitive account information such as user
                passwords.
              </li>
              <li>
                Circumvent, disable, or otherwise interfere with
                security-related features of the platform, including features
                that prevent or restrict the use or copying of any content or
                enforce limitations on the use of the platform and/or the
                content contained therein.
              </li>
              <li>
                Disparage, tarnish, or otherwise harm, in our opinion, us and/or
                the platform.
              </li>
              <li>
                Use any information obtained from the platform in order to
                harass, abuse, or harm another person.
              </li>
              <li>
                Make improper use of our support services or submit false
                reports of abuse or misconduct.
              </li>
              <li>
                Use the platform in a manner inconsistent with any applicable
                laws or regulations.
              </li>
              <li>
                Engage in unauthorized framing of or linking to the platform.
              </li>
              <li>
                Upload or transmit (or attempt to upload or to transmit)
                viruses, Trojan horses, or other material, including excessive
                use of capital letters and spamming (continuous posting of
                repetitive text), that interferes with any party's uninterrupted
                use and enjoyment of the platform or modifies, impairs,
                disrupts, alters, or interferes with the use, features,
                functions, operation, or maintenance of the platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-700">
              In order to resolve a complaint regarding the platform or to
              receive further information regarding use of the platform, please
              contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="font-medium">Nexus, Inc.</p>
              <p className="text-gray-700">123 Tech Street</p>
              <p className="font-medium">Nexus, Inc.</p>
              <p className="text-gray-700">123 Tech Street</p>
              <p className="text-gray-700">San Francisco, CA 94105</p>
              <p className="text-gray-700">Email: legal@nexus.com</p>
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
              <Link href="/privacy" className="text-gray-500 hover:text-black">
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-black font-bold"
              >
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
