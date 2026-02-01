import type { Metadata } from "next";
import "./globals.css";
import "./admin-globals.css";

export const metadata: Metadata = {
  title: {
    default: "NPC Admin",
    template: "%s | NPC Admin",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
