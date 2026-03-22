import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: appUrl ? new URL(appUrl) : undefined,
  title: {
    default: "SimAI — Describe it. See it. Understand it.",
    template: "%s · SimAI",
  },
  description:
    "Describe any concept in plain English and get an interactive browser simulation powered by AI.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "SimAI",
    title: "SimAI — Describe it. See it. Understand it.",
    description:
      "Describe any concept in plain English and get an interactive browser simulation powered by AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SimAI",
    description:
      "Describe any concept in plain English and get an interactive browser simulation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
