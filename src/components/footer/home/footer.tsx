import Logo from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function FooterHome() {
  return (
    <footer className="bg-background w-full mt-3">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-semibold">
            Virtual Queue Management System
          </span>
        </div>
        <div>&copy; {new Date().getFullYear()} VQMS. All rights reserved.</div>
        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/about">
            <Button variant="link" className="text-white hover:text-gray-300">
              About
            </Button>
          </Link>
          <Link href="/terms">
            <Button variant="link" className="text-white hover:text-gray-300">
              Terms
            </Button>
          </Link>
          <Link href="/privacy">
            <Button variant="link" className="text-white hover:text-gray-300">
              Privacy
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="link" className="text-white hover:text-gray-300">
              Contact
            </Button>
          </Link>
        </div>
      </div>

    
    </footer>
  );
}

export default FooterHome;
