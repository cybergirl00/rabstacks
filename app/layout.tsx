import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProvider } from '@/components/providers/convex-provider';
import { Toaster } from '@/components/ui/sonner';
import { TailwindSafelist } from './_safelist.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RabStacks - UI Component Library',
  description: 'Create, share, and discover beautiful UI components',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConvexProvider>
            <TailwindSafelist />
            {children}
            <Toaster />
          </ConvexProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}