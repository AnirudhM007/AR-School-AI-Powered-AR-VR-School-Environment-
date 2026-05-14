import type { Metadata, Viewport } from 'next';
import { Manrope, Sora } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import DevPreviewReset from '@/components/DevPreviewReset';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

const headingFont = Sora({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'AR School - Learn with Augmented Reality',
  description:
    'An immersive AR-powered educational platform. Explore 3D models, interact with AR objects, and get AI explanations in your browser.',
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
  themeColor: '#6c7cff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} min-h-dvh bg-brand-bg text-white antialiased`}
        suppressHydrationWarning
      >
        <DevPreviewReset />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
