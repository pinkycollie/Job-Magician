import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MBTQ Lifecycle System",
  description: "Manage your product lifecycle",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
