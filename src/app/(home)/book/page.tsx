"use server";

import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import QRScanner from "@/components/misc/qr-code-scanner";
import ProjectSelector from "@/components/misc/project-selector";
import Link from "next/link";
import Logo from "@/components/brand/logo";
import { listAllProjectsForUser } from "@/actions/users/business";

export default async function BookPage() {

  const projects = await listAllProjectsForUser({ status: "PUBLIC" });

  async function handleQrScan(detectedCodes: IDetectedBarcode[]) {
    "use server";

    if (detectedCodes && detectedCodes.length > 0) {
      const data = detectedCodes[0].rawValue;
      const username = data.split("/").pop();
      if (username) {
        redirect(`/${username}`);
      }
    }
  }

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
      <Card className="max-w-lg mx-auto bg-background">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Select Project or Scan QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
         
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <div className="w-full max-w-md mx-auto">
                <Suspense fallback={<div>Loading QR Scanner...</div>}>
                  <QRScanner onScan={handleQrScan} />
                </Suspense>
              </div>
            </div>

        
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

          
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Select Business Manually
              </h3>
              {projects.length === 0 ? (
                <p>No public projects available</p>
              ) : (
                <Suspense fallback={<div>Loading project selector...</div>}>
                  <ProjectSelector projects={projects} />
                </Suspense>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
