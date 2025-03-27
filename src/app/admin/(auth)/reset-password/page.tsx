import ResetPasswordForm from "@/components/auth/reset-password/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className=" w-full h-screen flex justify-center items-center">
      <ResetPasswordForm
        back={
          <Link href="/admin/login" className="w-full">
            <Button variant="ghost" className="w-full">
              Back To Login
            </Button>
          </Link>
        }
      />
    </div>
  );
}

export default Page;
