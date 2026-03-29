// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://e-mart.com.bd'),
  title: { default:'Emart Skincare Bangladesh — Korean & Japanese Beauty', template:'%s | Emart Skincare' },
  description:"Bangladesh's #1 destination for authentic Korean & Japanese skincare. 100% genuine, COD available.",
  keywords:['Korean skincare Bangladesh','Japanese skincare','K-beauty Dhaka','COSRX Bangladesh','skin care price Bangladesh'],
  openGraph:{ type:'website', locale:'en_BD', siteName:'Emart Skincare Bangladesh' },
  robots:{ index:true, follow:true },
};

export default function RootLayout({ children }:{ children:React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-poppins bg-white text-gray-800 antialiased">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="top-center" toastOptions={{
            style:{ fontFamily:'Poppins,sans-serif', borderRadius:'12px' },
            success:{ iconTheme:{ primary:'#e8197a', secondary:'#fff' } },
          }}/>
        </Providers>
      </body>
    </html>
  );
}
