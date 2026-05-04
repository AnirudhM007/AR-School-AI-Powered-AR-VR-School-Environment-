import type { Metadata, Viewport } from 'next';
import './globals.css';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'AR School – Learn with Augmented Reality',
  description: 'An immersive AR-powered educational platform. Explore 3D models, interact with AR objects, and get AI explanations — all in your browser.',
  keywords: ['AR', 'education', 'augmented reality', 'learning', '3D models', 'WebXR'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AR School',
  },
  openGraph: {
    title: 'AR School',
    description: 'Learn with Augmented Reality',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#7C3AED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="gradient-bg min-h-dvh" suppressHydrationWarning>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
