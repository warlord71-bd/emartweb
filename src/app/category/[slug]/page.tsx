import { getCategoryBySlug, getProducts, decodeHtml } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Next.js 15+: params is a Promise and must be awaited
interface P { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryBySlug(slug);
  if (!c) return { title: 'Not Found' };
  return { title: `${c.name} — Korean & Japanese Skincare Bangladesh`, description: `Shop ${c.name} products. Authentic K-beauty. COD available.` };
}

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: P) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const { products, total } = await getProducts({ category: category.id.toString(), per_page: 20, orderby: 'popularity', order: 'desc' });
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">{decodeHtml(category.name)}</h1>
        <p className="text-gray-500 text-sm">{total} products</p>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="text-center py-20 text-gray-400"><p>No products yet.</p><a href="/shop" className="text-[#e8197a] hover:underline mt-2 block">Browse All</a></div>
      )}
    </div>
  );
}
