import SignUpForm from "@/components/auth/signup/form";
import Logo from "@/components/brand/logo";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <Link
        href="/business"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Logo className="size-16" />
        </div>
        VQMS
      </Link>
      <SignUpForm />
    </div>
  );
}

export default Page;
