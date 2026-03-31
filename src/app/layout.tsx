import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('http://5.189.188.229/web'),
  title: { default:'Emart Skincare Bangladesh — Korean & Japanese Beauty', template:'%s | Emart Skincare' },
  description:"Bangladesh's #1 destination for authentic Korean & Japanese skincare. 100% genuine, COD available.",
  keywords:['Korean skincare Bangladesh','Japanese skincare','K-beauty Dhaka','COSRX Bangladesh','skin care price Bangladesh'],
  openGraph:{ type:'website', locale:'en_BD', siteName:'Emart Skincare Bangladesh' },
  robots:{ index:true, follow:true },
};

export default function RootLayout({ children }:{ children:React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800 antialiased pb-20 lg:pb-0" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>
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
