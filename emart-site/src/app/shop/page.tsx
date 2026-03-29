// src/app/shop/page.tsx
import { getProducts, getCategories } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Shop All Korean & Japanese Skincare'};
export const revalidate=1800;
interface P{searchParams:{page?:string;category?:string;orderby?:string;order?:string;on_sale?:string;min_price?:string;max_price?:string}}
export default async function ShopPage({searchParams}:P) {
  const page=parseInt(searchParams.page||'1');
  const [{products,total,totalPages},categories]=await Promise.all([
    getProducts({page,per_page:20,category:searchParams.category,orderby:(searchParams.orderby as any)||'date',order:(searchParams.order as any)||'desc',on_sale:searchParams.on_sale==='true',min_price:searchParams.min_price,max_price:searchParams.max_price}),
    getCategories(),
  ]);
  const sp=new URLSearchParams(searchParams as any);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-[#1a1a2e]">All Products</h1><p className="text-gray-500 text-sm">{total} products</p></div>
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#e8197a]">
          <option value="date-desc">Latest</option><option value="popularity-desc">Popular</option>
          <option value="price-asc">Price: Low–High</option><option value="price-desc">Price: High–Low</option>
        </select>
      </div>
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0 space-y-5">
          <div>
            <h3 className="font-bold text-[#1a1a2e] text-xs uppercase tracking-wide mb-3">Category</h3>
            <div className="space-y-1">
              {[{name:'All',id:''},...categories.slice(0,14)].map(c=>(
                <a key={c.id||'all'} href={`/shop?${c.id?`category=${c.id}`:''}${searchParams.orderby?`&orderby=${searchParams.orderby}`:''}`}
                   className={`block px-3 py-2 rounded-lg text-sm transition-colors ${searchParams.category===String(c.id)?'bg-[#e8197a] text-white':'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}>
                  {c.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-[#1a1a2e] text-xs uppercase tracking-wide mb-3">Offers</h3>
            <a href={`/shop?on_sale=${searchParams.on_sale==='true'?'':'true'}`}
               className={`block px-3 py-2 rounded-lg text-sm transition-colors ${searchParams.on_sale==='true'?'bg-[#e8197a] text-white':'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}>
              🔥 On Sale Only
            </a>
          </div>
          <div>
            <h3 className="font-bold text-[#1a1a2e] text-xs uppercase tracking-wide mb-3">Price</h3>
            {[{l:'Under ৳500',min:'',max:'500'},{l:'৳500–৳1,000',min:'500',max:'1000'},{l:'৳1,000–৳2,000',min:'1000',max:'2000'},{l:'Above ৳2,000',min:'2000',max:''}].map(p=>(
              <a key={p.l} href={`/shop?min_price=${p.min}&max_price=${p.max}`}
                 className={`block px-3 py-2 rounded-lg text-sm transition-colors ${searchParams.min_price===p.min&&searchParams.max_price===p.max?'bg-[#e8197a] text-white':'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}>
                {p.l}
              </a>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {products.length>0?(
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(p=><ProductCard key={p.id} product={p}/>)}
              </div>
              {totalPages>1&&(
                <div className="flex justify-center gap-2 mt-10 flex-wrap">
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                    <a key={p} href={`/shop?page=${p}${searchParams.category?`&category=${searchParams.category}`:''}`}
                       className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-colors
                                   ${p===page?'bg-[#e8197a] text-white border-[#e8197a]':'border-gray-200 text-gray-600 hover:border-[#e8197a] hover:text-[#e8197a]'}`}>
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          ):(
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🛍️</div>
              <p className="text-lg font-medium">No products found</p>
              <a href="/shop" className="text-[#e8197a] hover:underline mt-2 block">Clear filters</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
