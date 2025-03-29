"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-8">
          About Virtual Queue Management System
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          The Virtual Queue Management System (VQMS) is more than just a
          tool—it’s a transformative solution designed to address the challenges
          of traditional queue management faced by small businesses. From
          crowded waiting areas to frustrated customers, we understand the pain
          points and have crafted a system to eliminate them entirely.
        </p>
        <p className="text-lg text-muted-foreground mb-6">
          Our mission is simple: to reduce wait times, improve customer
          satisfaction, and empower businesses with the tools they need to
          thrive in a fast-paced world. By leveraging a digital-first approach,
          VQMS allows customers to join queues remotely, track their status in
          real time, and receive personalized notifications—all while giving
          businesses actionable insights to optimize their operations.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-lg text-muted-foreground mb-6">
          VQMS was developed as a Bachelor of Computer Applications (BCA)
          project by Amit, a passionate student at IGNOU, under the expert
          guidance of Mr. Tarun Kumar Gupta, Assistant Professor at Miranda
          House, Delhi University. What began as an academic endeavor has
          evolved into a practical, real-world solution aimed at revolutionizing
          how small businesses operate.
        </p>
        <p className="text-lg text-muted-foreground mb-6">
          With a strong foundation in modern technologies—Node.js for the
          backend, MySQL for data management, and Firebase Cloud Messaging for
          real-time notifications—VQMS combines academic rigor with practical
          innovation. Our system is built to be scalable, secure, and intuitive,
          catering to a variety of industries including healthcare, hospitality,
          retail, and more.
        </p>
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        <p className="text-lg text-muted-foreground mb-12">
          We envision a world where waiting in line is a thing of the past. By
          continuously improving our platform with features like AI-powered
          analytics, multilingual support, and mobile app integration, we aim to
          set a new standard for customer service and operational efficiency.
          Join us on this journey to redefine queue management for the better.
        </p>

        <h2 className="text-2xl font-semibold mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-5xl mx-auto">
          {/* Guide Card */}
          <Card className="w-full max-w-sm mx-auto bg-background border rounded-lg overflow-hidden shadow-lg">
            <CardHeader className="flex flex-col items-center  p-6">
              <div className="relative w-full aspect-square max-w-[200px] mb-4">
                <Image
                  src="/tarun.png"
                  alt="Mr. Tarun Kumar Gupta"
                  fill
                  className="rounded-md object-cover border-2 border-gray-300"
                />
              </div>
              <CardTitle className="text-xl font-semibold ">
                Mr. Tarun Kumar Gupta
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Project Guide | Assistant Professor
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4 text-center text-sm md:text-base">
                Mr. Tarun Kumar Gupta is an accomplished academic with a Ph.D.
                in Computer Science from Jamia Millia Islamia. As an Assistant
                Professor at Miranda House, Delhi University, he brings
                expertise in ANN optimization and nature-inspired techniques,
                guiding the VQMS project to success.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="mailto:tarun.gupta@mirandahouse.ac.in"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="https://in.linkedin.com/in/dr-tarun-kumar-gupta-77570559"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="mr-2 h-4 w-4" /> LinkedIn
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card className="w-full max-w-sm mx-auto bg-background border rounded-lg overflow-hidden shadow-lg">
            <CardHeader className="flex flex-col items-center  p-6">
              <div className="relative w-full aspect-square max-w-[200px] mb-4">
                <Image
                  src="/amit.png"
                  alt="Amit"
                  fill
                  className="rounded-md object-cover border-2 border-gray-300"
                />
              </div>
              <CardTitle className="text-xl font-semibold">
                Amit
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Developer | BCA Student, IGNOU
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4 text-center text-sm md:text-base">
                Amit is a dedicated BCA student at IGNOU with a passion for
                technology and innovation. As the creator of VQMS, he has
                leveraged his skills in web development and database management
                to build a practical solution for small businesses.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="https://twitter.com/beamitpal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="mr-2 h-4 w-4" /> Twitter
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="https://linkedin.com/in/beamitpal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="mr-2 h-4 w-4" /> LinkedIn
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href="https://github.com/beamitpal"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="mr-2 h-4 w-4" /> GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}