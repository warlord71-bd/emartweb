import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, getProducts } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailClient from '@/components/product/ProductDetail';

// Next.js 15+: params is a Promise and must be awaited
interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: 'Product Not Found' };
  return {
    title: `${p.name} Price in Bangladesh`,
    description: p.short_description.replace(/<[^>]+>/g, '').substring(0, 160),
    openGraph: { images: [{ url: p.images[0]?.src || '' }] },
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  console.log('[ProductPage] slug:', slug);
  const product = await getProduct(slug);
  if (!product) notFound();
  const { products: related } = await getProducts({ category: product.categories[0]?.id?.toString(), per_page: 4 });
  const filtered = related.filter(p => p.id !== product.id).slice(0, 4);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductDetailClient product={product} />
      {filtered.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="section-title mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
