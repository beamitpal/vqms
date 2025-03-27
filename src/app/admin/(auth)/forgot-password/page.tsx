import ForgotPassWordForm from "@/components/auth/forgot-password/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function Page() {
  return (
    <div className="flex justify-center items-center w-full h-screen ">
      <ForgotPassWordForm
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
