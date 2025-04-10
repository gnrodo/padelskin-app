import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-provider"; // Usar nuestro provider personalizado
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster from sonner
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PadelSkin App",
  description: "Platform for padel club management and court bookings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-200 dark:bg-slate-800`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" // Set default theme to dark
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              {/* Footer Placeholder could go here */}
            </div>
          </ThemeProvider>
          <Toaster richColors /> {/* Add Toaster component */}
        </AuthProvider>
      </body>
    </html>
  );
}
