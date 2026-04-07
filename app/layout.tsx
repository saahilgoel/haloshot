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
  metadataBase: new URL("https://haloshot.com"),
  title: {
    default: "HaloShot — AI Headshots Powered by the Halo Effect | Score Your Photo Free",
    template: "%s | HaloShot",
  },
  description:
    "Your photo makes a first impression in 100ms. HaloShot scores your photo for warmth, competence & trustworthiness, then generates AI headshots that exploit the halo effect. Free Halo Score. 60 seconds. From $9.99/mo.",
  openGraph: {
    title: "HaloShot — AI Headshots Powered by the Halo Effect | Score Your Photo Free",
    description:
      "Your photo makes a first impression in 100ms. HaloShot scores your photo for warmth, competence & trustworthiness, then generates AI headshots that exploit the halo effect. Free Halo Score. 60 seconds.",
    type: "website",
    url: "https://haloshot.com",
    siteName: "HaloShot",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaloShot — AI Headshots Powered by the Halo Effect",
    description:
      "Score your photo for warmth, competence & trustworthiness. Get AI headshots in 60 seconds. Free Halo Score.",
  },
  icons: { icon: "/favicon.svg" },
  alternates: {
    canonical: "https://haloshot.com",
  },
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
