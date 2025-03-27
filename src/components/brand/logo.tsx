import React from "react";

function Logo({ ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
     
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="100" cy="100" r="100" fill="white" />
      <path
        d="M71.374 60.704C72.8247 60.3627 74.9153 60.448 77.646 60.96C80.0353 61.3867 82.638 62.624 85.454 64.672C92.7073 70.1333 96.9313 81.9947 98.126 100.256C98.5527 106.656 98.4673 114.123 97.87 122.656C97.6993 127.179 97.4007 130.677 96.974 133.152V133.664L97.742 133.024C111.993 120.736 122.659 109.301 129.742 98.72C132.985 93.7707 135.033 89.7173 135.886 86.56C136.313 85.024 136.313 83.4453 135.886 81.824C135.033 79.52 133.582 77.8133 131.534 76.704C130.083 76.0213 128.505 75.5947 126.798 75.424C126.115 75.424 125.603 75.3387 125.262 75.168C124.238 74.4853 123.854 73.0347 124.11 70.816C124.366 67.1467 125.646 64.16 127.95 61.856C128.462 61.4293 128.931 61.088 129.358 60.832C129.785 60.6613 130.51 60.576 131.534 60.576C134.094 60.6613 136.441 61.472 138.574 63.008C140.963 64.6293 142.67 67.0187 143.694 70.176C145.315 74.784 145.23 80.16 143.438 86.304C139.683 100.384 128.846 116.299 110.926 134.048C102.563 142.24 94.67 149.024 87.246 154.4C86.222 155.083 85.454 155.424 84.942 155.424C84.5153 155.424 84.1313 155.253 83.79 154.912C82.766 153.888 82.51 151.84 83.022 148.768C84.1313 142.453 84.8993 135.413 85.326 127.648C86.1793 115.957 85.9233 105.291 84.558 95.648C83.022 84.64 79.822 77.1307 74.958 73.12C72.654 71.2427 69.71 70.176 66.126 69.92C65.4433 69.92 64.8033 69.7493 64.206 69.408C63.0967 68.8107 62.8833 67.7013 63.566 66.08C64.2487 64.8853 65.1447 63.8613 66.254 63.008C67.9607 61.728 69.6673 60.96 71.374 60.704Z"
        fill="black"
      />
    </svg>
  );
}

export default Logo;
