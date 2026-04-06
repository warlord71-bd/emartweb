// ═══════════════════════════════════════════
// FILE 1: src/app/category/[slug]/page.tsx
// ═══════════════════════════════════════════
import { getCategoryBySlug, getProducts } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: `${cat.name} — Korean & Japanese Skincare Bangladesh`,
    description: `Shop ${cat.name} products. Authentic Korean & Japanese skincare. COD available.`,
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const { products, total } = await getProducts({
    category: category.id.toString(),
    per_page: 20,
    orderby: 'popularity',
    order: 'desc',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">{category.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{total} products</p>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p>No products in this category yet.</p>
          <a href="/shop" className="text-[#e8197a] hover:underline mt-2 block">Browse All</a>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// FILE 2: src/components/product/ProductFilters.tsx
// ═══════════════════════════════════════════
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import type { WooCategory } from '@/lib/woocommerce';

interface Props {
  categories: WooCategory[];
  searchParams: Record<string, string | undefined>;
}

export function ProductFilters({ categories, searchParams }: Props) {
  const router = useRouter();

  const apply = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-3">
          Category
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => apply('category', '')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${!searchParams.category ? 'bg-[#e8197a] text-white' : 'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}
          >
            All Categories
          </button>
          {categories.slice(0, 15).map((cat) => (
            <button
              key={cat.id}
              onClick={() => apply('category', cat.id.toString())}
              className={`flex justify-between w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                          ${searchParams.category === cat.id.toString()
                            ? 'bg-[#e8197a] text-white'
                            : 'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}
            >
              <span>{cat.name}</span>
              {cat.count !== undefined && (
                <span className="text-xs opacity-70">({cat.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* On Sale */}
      <div>
        <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-3">Offers</h3>
        <button
          onClick={() => apply('on_sale', searchParams.on_sale === 'true' ? '' : 'true')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      ${searchParams.on_sale === 'true' ? 'bg-[#e8197a] text-white' : 'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}
        >
          🔥 On Sale Only
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-3">Price</h3>
        <div className="space-y-2">
          {[
            { label: 'Under ৳500', min: '', max: '500' },
            { label: '৳500 – ৳1,000', min: '500', max: '1000' },
            { label: '৳1,000 – ৳2,000', min: '1000', max: '2000' },
            { label: 'Above ৳2,000', min: '2000', max: '' },
          ].map(({ label, min, max }) => (
            <button
              key={label}
              onClick={() => {
                apply('min_price', min);
                apply('max_price', max);
              }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                          ${searchParams.min_price === min && searchParams.max_price === max
                            ? 'bg-[#e8197a] text-white'
                            : 'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All */}
      {(searchParams.category || searchParams.on_sale || searchParams.min_price) && (
        <button
          onClick={() => router.push('/shop')}
          className="w-full text-center text-sm text-gray-400 hover:text-[#e8197a] underline"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

export default ProductFilters;


// ═══════════════════════════════════════════
// FILE 3: src/app/providers.tsx
// ═══════════════════════════════════════════
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      useCartStore.persist.rehydrate();
      hydrated.current = true;
    }
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}


// ═══════════════════════════════════════════
// FILE 4: src/components/layout/Footer.tsx
// ═══════════════════════════════════════════
import Link from 'next/link';

const SHOP_LINKS = [
  { label: 'All Products', href: '/shop' },
  { label: 'Face Care', href: '/category/face-care' },
  { label: 'Sunscreen & SPF', href: '/category/sunscreen' },
  { label: 'Serum & Toner', href: '/category/serum-toner' },
  { label: 'Moisturizer', href: '/category/moisturizer' },
  { label: 'Cleanser', href: '/category/cleanser' },
  { label: 'Hair Care', href: '/category/hair-care' },
  { label: '🔥 Sale', href: '/sale' },
  { label: '✨ New Arrivals', href: '/new-arrivals' },
];

const HELP_LINKS = [
  { label: 'My Account', href: '/account' },
  { label: 'Track My Order', href: '/track-order' },
  { label: 'Return & Refund', href: '/return-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'About Us', href: '/about-us' },
];

const SOCIALS = [
  { href: 'https://www.facebook.com/emartbd.official', bg: '#1877f2', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { href: 'https://wa.me/8801919797399', bg: '#25d366', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z' },
  { href: 'https://t.me/emart_official', bg: '#2aabee', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.57-.45.71-.91.44l-2.52-1.86-1.22 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1L7.39 14.6 4.9 13.84c-.56-.17-.57-.56.12-.83l10.38-4c.47-.17.88.11.74.83z' },
];

const PAYMENTS = [
  { label: 'bKash', color: '#e2136e' },
  { label: 'Nagad', color: '#f26522' },
  { label: 'Rocket', color: '#8b3fc8' },
  { label: 'VISA', color: '#1a1f71' },
  { label: 'Mastercard', color: '#eb001b' },
  { label: '💵 COD', color: '#16a34a' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 hidden lg:block">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-4 gap-8">

        {/* Brand Column — CSS logo, no image file required */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-[#e8197a] to-[#c01264] rounded-xl
                            flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xl">E</span>
            </div>
            <div>
              <div className="font-extrabold text-[#1a1a2e]">Emart Skincare</div>
              <div className="text-[#e8197a] text-[9px] font-bold tracking-widest uppercase">Bangladesh</div>
            </div>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Bangladesh's #1 destination for authentic Korean & Japanese skincare.
            Every product 100% genuine.
          </p>
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                 style={{ background: s.bg }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-4
                         pb-2 border-b-2 border-[#e8197a] inline-block">Shop</h3>
          <ul className="space-y-2">
            {SHOP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-gray-500 hover:text-[#e8197a] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Links + B2B Box */}
        <div>
          <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-4
                         pb-2 border-b-2 border-[#e8197a] inline-block">Help</h3>
          <ul className="space-y-2 mb-4">
            {HELP_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-gray-500 hover:text-[#e8197a] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-4 bg-[#fce7f0] rounded-xl border border-[#f0a8c8]">
            <div className="font-bold text-[#1a1a2e] text-sm mb-1">🏪 Wholesale / B2B</div>
            <div className="text-xs text-gray-500 mb-2">Korean & Japanese cosmetics for retailers across Bangladesh</div>
            <a href="https://kcoswbd.com" target="_blank" rel="noopener noreferrer"
               className="text-xs bg-[#e8197a] text-white px-3 py-1.5 rounded-lg font-semibold inline-block">
              Visit kcoswbd.com →
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-4
                         pb-2 border-b-2 border-[#e8197a] inline-block">Contact</h3>
          <div className="space-y-3 text-sm text-gray-500">
            <div>📍 17, Central Road (Near Ideal College)<br />Dhanmondi, Dhaka-1205</div>
            <div>📞 <a href="tel:+8809697597399" className="text-[#e8197a] font-semibold">+880 9697-597399</a></div>
            <div>📞 <a href="tel:+8801919797399" className="text-[#e8197a] font-semibold">+880 1919-797399</a></div>
            <div>✉️ <a href="mailto:emart.bdofficial@gmail.com" className="text-[#e8197a] text-xs">emart.bdofficial@gmail.com</a></div>
            <div>🕘 Sat–Thu: 9AM – 9PM BST</div>
            <div className="pt-1">
              <div className="text-xs font-semibold text-gray-600 mb-1">Payment:</div>
              <div className="text-xs">bKash: <strong className="text-[#e2136e]">01919-797399</strong></div>
              <div className="text-xs">Nagad: <strong className="text-[#f26522]">01919-797399</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Strip */}
      <div className="border-t border-gray-100 bg-gray-50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400 uppercase">We Accept:</span>
            {PAYMENTS.map((p) => (
              <span key={p.label}
                    className="text-xs font-bold px-2 py-1 rounded border bg-white"
                    style={{ color: p.color, borderColor: p.color }}>
                {p.label}
              </span>
            ))}
          </div>
          <div className="flex gap-3 text-xs text-gray-400">
            <span>🚚 Free ৳3,000+</span>
            <span>⚡ Dhaka Next Day</span>
            <span>🇧🇩 Nationwide</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#252538] text-gray-400 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>© 2025 <Link href="/" className="text-[#e8197a] font-semibold">Emart Skincare Bangladesh</Link>. All rights reserved.</p>
          <div className="flex gap-4">
            {[
              { label: 'Privacy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms-conditions' },
              { label: 'Returns', href: '/return-policy' },
              { label: 'Sitemap', href: '/sitemap_index.xml' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[#e8197a] transition-colors text-xs">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
