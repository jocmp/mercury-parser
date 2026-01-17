import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mercury Parser Demo',
  description: 'Demo app for testing Mercury Parser',
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
