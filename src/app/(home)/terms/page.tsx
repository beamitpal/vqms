"use client";

import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        <section className="space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Virtual Queue Management System (VQMS), you agree to be bound by these Terms and Conditions, as well as all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using our services. These terms may be updated periodically, and continued use of the service constitutes acceptance of any changes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
            <p>
              VQMS is intended for personal and business use to manage customer queues efficiently. You agree to use the service only for lawful purposes and in a manner consistent with its intended functionality. Any misuse, including but not limited to hacking, spamming, or attempting to disrupt the system, may result in immediate suspension or termination of your access without prior notice.
            </p>
            <p>
              Users are responsible for maintaining the confidentiality of any account information and for all activities that occur under their account. VQMS reserves the right to refuse service to anyone for any reason at any time.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p>
              All content, software, and materials provided through VQMS, including but not limited to text, graphics, logos, and code, are the intellectual property of VQMS or its licensors. You may not reproduce, distribute, or create derivative works from this content without express written permission.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
            <p>
              VQMS and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, including but not limited to loss of profits, data, or business opportunities. The service is provided “as is,” and we make no warranties regarding its availability, accuracy, or reliability.
            </p>
            <p>
              In the event of technical issues, such as server downtime or notification delays, VQMS will strive to resolve them promptly but cannot guarantee uninterrupted service. Users acknowledge that they use the system at their own risk.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to VQMS at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}