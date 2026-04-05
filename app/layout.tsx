import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
