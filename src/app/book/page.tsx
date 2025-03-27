"use server";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBusiness } from "@/lib/misc";
import {
  getProjectByUsername,
  listAllProjects,
} from "@/actions/business/projects";
import { QRScanner } from "@/components/misc/qr-code-scanner";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { IDetectedBarcode } from "@yudiel/react-qr-scanner";

export default async function BookPage() {
  const cookieStore = await cookies();
  const business = await getBusiness({
    cookies: {
      get: (name: string) => cookieStore.get(name),
    },
  });
  const businessId = business?.id;

  if (!businessId) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent>
            <p className="text-red-500">Please log in to view projects</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projects = await listAllProjects({ businessId });

  async function handleSubmit(formData: FormData) {
    "use server";
    const cookieStore = await cookies();
    const business = await getBusiness({
      cookies: {
        get: (name: string) => cookieStore.get(name),
      },
    });
    const businessId = business?.id;
    if (!businessId) return;

    const username = formData.get("username") as string;
    const project = await getProjectByUsername(username, businessId);
    if (project) {
      redirect(`/${project.username}`);
    }
  }

  async function handleQrScan(detectedCodes: IDetectedBarcode[]) {
    "use server";
    const cookieStore = await cookies();
    const business = await getBusiness({
      cookies: {
        get: (name: string) => cookieStore.get(name),
      },
    });
    const businessId = business?.id;
    if (!businessId) return;

    if (detectedCodes && detectedCodes.length > 0) {
      const data = detectedCodes[0].rawValue; // Extract the raw value from the first detected barcode
      const username = data.split("/").pop();
      if (username) {
        const project = await getProjectByUsername(username, businessId);
        if (project) {
          redirect(`/${project.username}`);
        }
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Project or Scan QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* QR Scanner Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Scan QR Code</h3>
              <div className="w-full max-w-md mx-auto">
                <Suspense fallback={<div>Loading QR Scanner...</div>}>
                  <QRScanner onScan={handleQrScan} />
                </Suspense>
              </div>
            </div>

            {/* Manual Selection Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Or Select Project Manually
              </h3>
              {projects.length === 0 ? (
                <p>No projects available</p>
              ) : (
                <form action={handleSubmit} className="space-y-4">
                  <Select name="username">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.username}>
                          {project.name} (@{project.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="submit" className="w-full">
                    Go to Project
                  </Button>
                </form>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
