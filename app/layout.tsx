import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-cabinet",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-general",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "HaloShot — Your Photo Is Making a First Impression Without You",
  description:
    "AI headshots that exploit the halo effect. Score your current photo, get a glow-up in 60 seconds. The science of first impressions, perfected.",
  openGraph: {
    title: "HaloShot — Your Photo Is Making a First Impression Without You",
    description:
      "AI headshots that exploit the halo effect. Score your current photo, get a glow-up in 60 seconds. The science of first impressions, perfected.",
    type: "website",
    url: "https://haloshot.ai",
    siteName: "HaloShot",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaloShot — Your Photo Is Making a First Impression Without You",
    description:
      "AI headshots that exploit the halo effect. Score your current photo, get a glow-up in 60 seconds. The science of first impressions, perfected.",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
