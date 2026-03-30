import { searchProducts } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import type { Metadata } from 'next';
export const dynamic = 'force-dynamic';

interface P { searchParams: Promise<{ q?:string; page?:string }> }

export async function generateMetadata({ searchParams }: P): Promise<Metadata> {
  const sp = await searchParams;
  return { title:`Search: ${sp.q||''} — Emart Skincare`, robots:{index:false,follow:true} };
}

export default async function SearchPage({ searchParams }: P) {
  const sp = await searchParams;
  const q = sp.q||'';
  const page = parseInt(sp.page||'1');
  if(!q) return(
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-[#1a1a2e]">Search Products</h1>
      <p className="text-gray-500 mt-2">Enter a product name, brand, or concern</p>
    </div>
  );
  const {products,total,totalPages}=await searchProducts(q,page);
  return(
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Search: &ldquo;{q}&rdquo;</h1>
        <p className="text-gray-500 text-sm mt-1">{total} products found</p>
      </div>
      {products.length>0?(
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p=><ProductCard key={p.id} product={p}/>)}
          </div>
          {totalPages>1&&(
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <a key={p} href={`/search?q=${encodeURIComponent(q)}&page=${p}`}
                   className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-colors
                               ${p===page?'bg-[#e8197a] text-white border-[#e8197a]':'border-gray-200 hover:border-[#e8197a] hover:text-[#e8197a]'}`}>
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      ):(
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😔</div>
          <p className="text-gray-500 text-lg">No products found for &ldquo;{q}&rdquo;</p>
          <a href="/shop" className="btn-primary inline-block mt-4">Browse All Products</a>
        </div>
      )}
    </div>
  );
}
