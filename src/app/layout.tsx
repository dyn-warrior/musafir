import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { OfflineBanner } from "@/components/desktop/OfflineBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musafir",
  description: "Discover the world's hidden gems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={cn(
          inter.variable,
          outfit.variable,
          "antialiased font-sans bg-background text-foreground"
        )}
      >
        <OfflineBanner />
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <div className="md:hidden">
              <BottomNav />
            </div>
          </div>
          <AIAssistant />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
