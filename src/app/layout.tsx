"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
      </body>
    </html>
  );
}
