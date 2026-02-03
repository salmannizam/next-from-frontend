import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Form Lead — Collect & Manage Leads',
  description: 'Form builder and lead collection for Indian SMBs',
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
