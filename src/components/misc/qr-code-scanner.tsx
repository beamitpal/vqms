"use client";

import { Scanner, IScannerProps, IDetectedBarcode } from '@yudiel/react-qr-scanner';

// Extend IScannerProps with our custom onScan prop
interface QRScannerProps extends Omit<IScannerProps, 'onScan'> {
  onScan: (detectedCodes: IDetectedBarcode[]) => Promise<void>;
}

export function QRScanner({ onScan, ...props }: QRScannerProps) {
  return (
    <Scanner
      {...props}
      onScan={async (detectedCodes: IDetectedBarcode[]) => {
        await onScan(detectedCodes);
      }}
      onError={(error: unknown) => {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      }}
    />
  );
}