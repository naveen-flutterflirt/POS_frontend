// app/layout.tsx
import type { Metadata } from "next";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./globals.css";
import AmplifyConfigProvider from "./amplify-config";

export const metadata: Metadata = {
  title: "POS — Place of Supply",
  description: "Admin and cashier portal for POS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-nunito">
        {/* AmplifyConfigProvider is a 'use client' component — configures Amplify only on the client */}
        <AmplifyConfigProvider>{children}</AmplifyConfigProvider>
      </body>
    </html>
  );
}