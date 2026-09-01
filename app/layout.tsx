import type { Metadata } from 'next';
import { Geist, Geist_Mono, Montserrat } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mzmznasipadang.github.io/VicPortfolio'),
  title: 'Victor Chandra — iOS Engineer',
  description: 'iOS engineer and software developer building thoughtful mobile products.',
  openGraph: {
    title: 'Victor Chandra — iOS Engineer',
    description: 'iOS engineer and software developer building thoughtful mobile products.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victor Chandra — iOS Engineer',
    description: 'iOS engineer and software developer building thoughtful mobile products.',
    images: ['/og.png'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
