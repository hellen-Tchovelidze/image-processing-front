import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Image Processing Service",
  description: "Professional image processing service powered by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <TooltipProvider>
            <AuthProvider>{children}</AuthProvider>
              <Footer  />
              <Toaster />
            </TooltipProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
