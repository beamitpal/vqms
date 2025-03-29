"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileSymlink, UsersRound } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Virtual Queue Management System
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Say goodbye to long, frustrating queues and hello to a seamless, digital solution designed to enhance customer experiences and streamline business operations. Our Virtual Queue Management System (VQMS) empowers small businesses to manage customer flow efficiently, ensuring satisfaction and operational excellence.
        </p>
        <Button size="lg" asChild>
          <Link href="/book"><UsersRound /> Join a Queue Now</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-2xl">Real-Time Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Stay informed every step of the way with instant notifications about your queue position, estimated wait times, and upcoming service alerts. Whether you’re at home or on the go, our system keeps you updated in real time, ensuring you never miss your turn.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-2xl">Remote Check-In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              No need to wait in crowded spaces. With our remote check-in feature, you can join a queue from anywhere—be it your car, home, or office—and arrive just in time for your service. It’s convenience redefined for the modern customer.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-2xl">Business Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Empower your business with actionable data. Our system provides detailed reports and analytics on customer trends, peak hours, and operational efficiency, helping you optimize staffing, reduce wait times, and elevate customer satisfaction.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 text-center"
      >
        <h2 className="text-3xl font-semibold mb-6">Why Choose VQMS?</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Built with cutting-edge technologies like Next.js, PostgreSQL, VQMS offers a robust, scalable, and user-friendly platform. Whether you’re a small café, clinic, or retail store, our system adapts to your needs, reducing congestion and enhancing service delivery. Join the future of queue management today!
        </p>
        <Button  variant="outline" size="lg" asChild>
          <Link href="/about"> <FileSymlink /> Learn More About Us</Link>
        </Button>
      </motion.div>
    </div>
  );
}