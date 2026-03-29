// src/app/page.tsx — HOMEPAGE
import Link from 'next/link';
import { getFeaturedProducts, getSaleProducts } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title:'Emart Skincare Bangladesh — Korean & Japanese Beauty',
  description:"Bangladesh's #1 Korean & Japanese skincare. 100% authentic, COD available, fast delivery nationwide.",
};
export const revalidate = 3600;

const CATS=[
  {name:'Face Care',slug:'face-care',emoji:'✨',bg:'#fce7f0'},
  {name:'Sunscreen',slug:'sunscreen',emoji:'☀️',bg:'#fff7ed'},
  {name:'Serum & Toner',slug:'serum-toner',emoji:'💧',bg:'#eff6ff'},
  {name:'Moisturizer',slug:'moisturizer',emoji:'🧴',bg:'#f0fdf4'},
  {name:'Cleanser',slug:'cleanser',emoji:'🫧',bg:'#f5f3ff'},
  {name:'Hair Care',slug:'hair-care',emoji:'💆',bg:'#fff1f2'},
  {name:'Body Care',slug:'body-care',emoji:'🌸',bg:'#fefce8'},
  {name:'Makeup',slug:'makeup',emoji:'💄',bg:'#fdf4ff'},
];

export default async function HomePage() {
  const [featured, onSale] = await Promise.all([getFeaturedProducts(8), getSaleProducts(8)]);
  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#2d1b40] to-[#1a1a2e] text-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#e8197a]/20 border border-[#e8197a]/30 px-4 py-1.5 rounded-full text-sm font-medium text-[#e8197a] mb-5">
            🇰🇷 100% Authentic Korean & Japanese Skincare 🇯🇵
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 text-white">
            Your Skin Deserves<br/><span className="text-[#e8197a]">The Best</span>
          </h1>
          <p className="text-gray-300 text-base md:text-xl mb-8 max-w-2xl mx-auto">
            Bangladesh's #1 destination for genuine K-Beauty & J-Beauty. Fast delivery, COD available, 100% authentic guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/shop" className="btn-primary text-center px-8">Shop Now →</Link>
            <Link href="/sale" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-[#1a1a2e] transition-all text-center">🔥 View Sale</Link>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {['✅ 100% Authentic','💵 COD Available','🚚 Fast Delivery','↩️ Easy Returns'].map(b=>(
              <span key={b} className="text-xs font-medium bg-white/10 px-4 py-2 rounded-full text-gray-300">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Shop by Category</h2>
            <Link href="/shop" className="text-[#e8197a] font-semibold text-sm hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATS.map(c=>(
              <Link key={c.slug} href={`/category/${c.slug}`}
                className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl border-2 border-transparent hover:border-[#e8197a] hover:shadow-md transition-all group text-center cursor-pointer"
                style={{background:c.bg}}>
                <span className="text-3xl group-hover:scale-110 transition-transform">{c.emoji}</span>
                <span className="text-sm font-semibold text-[#1a1a2e]">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured.length>0&&(
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">⭐ Featured Products</h2>
              <Link href="/shop?featured=true" className="text-[#e8197a] font-semibold text-sm hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
          </div>
        </section>
      )}

      {/* B2B BANNER */}
      <section className="py-8 px-4 bg-[#1a1a2e]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-white">🏪 Wholesale / B2B?</h3>
            <p className="text-gray-400 mt-1 text-sm">Korean & Japanese cosmetics for retailers & resellers across Bangladesh</p>
          </div>
          <a href="https://kcoswbd.com" target="_blank" rel="noopener noreferrer" className="btn-primary whitespace-nowrap">Visit kcoswbd.com →</a>
        </div>
      </section>

      {/* ON SALE */}
      {onSale.length>0&&(
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">🔥 On Sale</h2>
              <Link href="/sale" className="text-[#e8197a] font-semibold text-sm hover:underline">View All →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {onSale.map(p=><ProductCard key={p.id} product={p}/>)}
            </div>
          </div>
        </section>
      )}

      {/* WHY EMART */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-10">Why Choose Emart?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {icon:'✅',title:'100% Authentic',desc:'Directly sourced from Korea & Japan'},
              {icon:'🚚',title:'Fast Delivery',desc:'Dhaka next day, nationwide 2-5 days'},
              {icon:'💵',title:'COD Available',desc:'Pay when you receive your order'},
              {icon:'↩️',title:'Easy Returns',desc:'Hassle-free 7-day return policy'},
            ].map(i=>(
              <div key={i.title} className="text-center p-5 rounded-2xl bg-gray-50 hover:bg-[#fce7f0] transition-colors">
                <div className="text-4xl mb-3">{i.icon}</div>
                <h3 className="font-bold text-[#1a1a2e] mb-1 text-sm">{i.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
