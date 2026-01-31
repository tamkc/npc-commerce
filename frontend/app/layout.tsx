import type { Metadata } from 'next';
import { Providers } from '@/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartInitializer } from '@/components/cart/CartInitializer';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'NPC Commerce',
    template: '%s | NPC Commerce',
  },
  description: 'AI-powered e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <CartInitializer />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
