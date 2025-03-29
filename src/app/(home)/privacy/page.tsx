"use client";

import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <section className="space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              At Virtual Queue Management System (VQMS), we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, store, and safeguard your personal information when you use our services. By using VQMS, you consent to the practices described herein.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">2. Data Collection</h2>
            <p>
              We collect personal information necessary to provide our queue management services. This includes, but is not limited to, your name, phone number, email address, and queue preferences. This data is gathered when you join a queue, check your status, or interact with our system through our website or future mobile app.
            </p>
            <p>
              Additionally, we may collect non-personal information such as browser type, IP address, and usage patterns to improve our service and user experience. This data is anonymized and used solely for analytical purposes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
            <p>
              Your personal information is used exclusively to facilitate queue management and communication. For example, we use your contact details to send real-time notifications about your queue status, estimated wait times, and service updates. We do not sell, rent, or share your data with third parties without your explicit consent, except as required by law.
            </p>
            <p>
              Internally, we may analyze aggregated data to generate reports and insights for businesses using our system, but this data is anonymized and does not identify individual users.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We prioritize the security of your information. VQMS employs industry-standard encryption protocols (e.g., SSL/TLS) and secure storage solutions like MySQL databases to protect your data from unauthorized access, loss, or misuse. Access to your information is restricted to authorized personnel only, and we regularly update our security measures to stay ahead of potential threats.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. To exercise these rights, please contact us via the details provided on our Contact page. We will respond to your request within a reasonable timeframe and in accordance with applicable data protection laws.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}