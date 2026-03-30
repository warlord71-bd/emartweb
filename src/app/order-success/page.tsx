import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Order Placed Successfully!',robots:{index:false,follow:false}};
export const dynamic = 'force-dynamic';

interface P { searchParams: Promise<{ id?:string }> }

export default async function OrderSuccessPage({ searchParams }: P) {
  const sp = await searchParams;
  return(
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6 animate-bounce">🎉</div>
      <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-3">Order Placed!</h1>
      {sp.id&&<p className="text-gray-500 mb-2">Order ID: <strong className="text-[#e8197a]">#{sp.id}</strong></p>}
      <p className="text-gray-600 mb-8 leading-relaxed">
        Thank you for your order! Our team will confirm via SMS/call shortly.<br/>
        For COD: Please keep the amount ready on delivery.<br/>
        For bKash/Nagad: We&apos;ll verify your payment.
      </p>
      <div className="bg-[#fce7f0] rounded-2xl p-5 mb-8 text-sm text-gray-600 space-y-2">
        <p>📞 Questions? Call us: <a href="tel:+8801919797399" className="text-[#e8197a] font-semibold">01919-797399</a></p>
        <p>💬 WhatsApp: <a href="https://wa.me/8801919797399" className="text-[#e8197a] font-semibold">01919-797399</a></p>
      </div>
      <Link href="/shop" className="btn-primary inline-block">Continue Shopping →</Link>
    </div>
  );
}
