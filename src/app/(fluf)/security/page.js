import Link from "next/link"
import { ArrowLeft, Shield, Lock, Server, Database, AlertTriangle } from "lucide-react"

export default function Security() {
  return (
    <main className="font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-4 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            nexus
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-gray-600 hover:text-black flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Security at Nexus</h1>

        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <p className="text-lg text-gray-700">
            We prioritize the security and protection of your data. Our platform is built with industry-leading security
            practices to ensure your information remains safe and confidential.
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 mr-3 text-black" />
              <h2 className="text-xl sm:text-2xl font-bold">Data Protection</h2>
            </div>
            <p className="text-gray-700 mb-4">
              At Nexus, we understand the sensitivity of educational data. All information stored on our platform is
              protected using enterprise-grade encryption standards to prevent unauthorized access.
            </p>
            <div className="bg-white border border-gray-200 rounded-lg p-5 mt-6">
              <h3 className="font-bold mb-2">Our security measures include:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>End-to-end encryption for all communications</li>
                <li>Regular security audits and penetration testing</li>
                <li>Advanced threat detection systems</li>
                <li>Secure data backup protocols</li>
                <li>Strict access controls for all internal systems</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 mr-3 text-black" />
              <h2 className="text-xl sm:text-2xl font-bold">Authentication & Access</h2>
            </div>
            <p className="text-gray-700 mb-4">
              We implement robust authentication mechanisms to ensure only authorized individuals can access specific
              data. Our platform supports:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-bold mb-2">For Institutions</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Single Sign-On (SSO) integration</li>
                  <li>Role-based access controls</li>
                  <li>Admin management console</li>
                  <li>Activity audit logs</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-bold mb-2">For Users</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Two-factor authentication</li>
                  <li>Secure password policies</li>
                  <li>Login attempt monitoring</li>
                  <li>Session timeout controls</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Server className="h-6 w-6 mr-3 text-black" />
              <h2 className="text-xl sm:text-2xl font-bold">Infrastructure Security</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Our infrastructure is built on industry-leading cloud providers with comprehensive security measures. We
              maintain:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Redundant systems across multiple geographic regions</li>
              <li>Continuous monitoring for suspicious activities</li>
              <li>Regular security patches and updates</li>
              <li>DDoS protection and mitigation strategies</li>
              <li>Network segmentation and firewall controls</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 mr-3 text-black" />
              <h2 className="text-xl sm:text-2xl font-bold">Compliance</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Nexus adheres to all relevant education data protection regulations and standards:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <p className="font-bold text-gray-700">FERPA Compliant</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <p className="font-bold text-gray-700">GDPR Ready</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <p className="font-bold text-gray-700">CCPA Compliant</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <p className="font-bold text-gray-700">SOC 2 Certified</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <p className="font-bold text-gray-700">ISO 27001</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                <p className="font-bold text-gray-700">COPPA Compliant</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 mr-3 text-black" />
              <h2 className="text-xl sm:text-2xl font-bold">Incident Response</h2>
            </div>
            <p className="text-gray-700 mb-4">
              In the unlikely event of a security incident, we have comprehensive response procedures in place:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>24/7 security monitoring team</li>
              <li>Documented incident response playbooks</li>
              <li>Regular simulated incident drills</li>
              <li>Transparent communication protocols</li>
              <li>Post-incident analysis and improvement processes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Contact Our Security Team</h2>
            <p className="text-gray-700 mb-4">
              If you have specific security questions or concerns, our dedicated security team is available to assist
              you:
            </p>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="font-medium">Nexus Security Team</p>
              <p className="text-gray-700">Email: security@nexus.com</p>
              <p className="text-gray-700">For security vulnerabilities: security-reports@nexus.com</p>
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                We welcome responsible disclosure of security vulnerabilities. Please review our security disclosure
                policy for details on how to report security issues.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500">© 2025 Nexus, Inc. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-black">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-black">
                Terms
              </Link>
              <Link href="/security" className="text-gray-500 hover:text-black font-bold">
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
