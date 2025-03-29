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
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our
        <Link href="/terms">Terms of Service</Link>
        and <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}

export default Page;
