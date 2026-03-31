// src/app/shop/page.tsx
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import ProductFilters from '@/components/product/ProductFilters';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Korean & Japanese Skincare',
  description: 'Browse our full collection of authentic Korean and Japanese skincare products.',
};

export const revalidate = 1800;

interface ShopPageProps {
  searchParams: {
    page?: string;
    category?: string;
    orderby?: string;
    order?: string;
    on_sale?: string;
    min_price?: string;
    max_price?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const page = parseInt(searchParams.page || '1');

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProducts({
      page,
      per_page: 20,
      category: searchParams.category,
      orderby: (searchParams.orderby as any) || 'date',
      order: (searchParams.order as any) || 'desc',
      on_sale: searchParams.on_sale === 'true',
      min_price: searchParams.min_price,
      max_price: searchParams.max_price,
    }),
    getCategories(),
  ]);

  // DEBUG: log first 3 products to verify correct data is being fetched
  console.log('[SHOP DEBUG] Total products fetched:', total);
  products.slice(0, 3).forEach((p, i) => {
    console.log(`[SHOP DEBUG] Product[${i}]: name="${p.name}", image="${p.images[0]?.src || 'NO IMAGE'}"`);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">All Products</h1>
          <p className="text-gray-500 text-sm mt-1">{total} products found</p>
        </div>

        {/* Sort */}
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:border-[#e8197a]"
          defaultValue={`${searchParams.orderby || 'date'}-${searchParams.order || 'desc'}`}
        >
          <option value="date-desc">Latest</option>
          <option value="popularity-desc">Most Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Top Rated</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <ProductFilters categories={categories} searchParams={searchParams} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/shop?page=${p}${searchParams.category ? `&category=${searchParams.category}` : ''}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg
                                  text-sm font-semibold border transition-colors
                                  ${p === page
                                    ? 'bg-[#e8197a] text-white border-[#e8197a]'
                                    : 'border-gray-200 text-gray-600 hover:border-[#e8197a] hover:text-[#e8197a]'
                                  }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🛍️</div>
              <p className="text-lg font-medium">No products found</p>
              <a href="/shop" className="text-[#e8197a] hover:underline mt-2 block">
                Clear filters
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
