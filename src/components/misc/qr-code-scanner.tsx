"use client";

import { useState } from "react";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";
import { QRScannerToggleProps } from "@/lib/types";



export default function QRScannerToggle({ onScan, ...props }: QRScannerToggleProps) {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      {!isScanning ? (
        <Button
          onClick={() => setIsScanning(true)}
          className="w-full"
        >
          <ScanLine />Start QR Code Scan
        </Button>
      ) : (
        <div className="space-y-2">
          <Scanner
            {...props}
            onScan={async (detectedCodes: IDetectedBarcode[]) => {
              await onScan(detectedCodes);
              setIsScanning(false);
            }}
            onError={(error: unknown) => {
              if (error instanceof Error) {
                console.error(error.message);
              } else {
                console.error("An unknown error occurred:", error);
              }
              setIsScanning(false); 
            }}
          />
          <Button
            onClick={() => setIsScanning(false)}
            variant="outline"
            className="w-full"
          >
            Cancel Scan
          </Button>
        </div>
      )}
    </div>
  );
}