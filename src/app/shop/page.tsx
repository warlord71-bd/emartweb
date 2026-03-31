import { getProducts, getCategories, decodeHtml } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Shop All Korean & Japanese Skincare'};
export const dynamic = 'force-dynamic';

interface SP { page?:string; category?:string; orderby?:string; order?:string; on_sale?:string; min_price?:string; max_price?:string }
interface P { searchParams: Promise<SP> }

const SORT_OPTIONS=[
  {label:'Latest',orderby:'date',order:'desc'},
  {label:'Popular',orderby:'popularity',order:'desc'},
  {label:'Top Rated',orderby:'rating',order:'desc'},
  {label:'Price: Low → High',orderby:'price',order:'asc'},
  {label:'Price: High → Low',orderby:'price',order:'desc'},
];

export default async function ShopPage({ searchParams }: P) {
  const sp = await searchParams;
  const page=parseInt(sp.page||'1');
  const orderby=sp.orderby||'date';
  const order=sp.order||'desc';

  const [{products,total,totalPages},categories]=await Promise.all([
    getProducts({
      page,per_page:20,
      category:sp.category,
      orderby:orderby as any,
      order:order as any,
      on_sale:sp.on_sale==='true',
      min_price:sp.min_price,
      max_price:sp.max_price,
    }),
    getCategories(),
  ]);

  // Build base query string (without page) for filters
  const baseQuery=(extra:string)=>{
    const parts:string[]=[];
    if(sp.category) parts.push(`category=${sp.category}`);
    if(sp.orderby) parts.push(`orderby=${sp.orderby}`);
    if(sp.order) parts.push(`order=${sp.order}`);
    if(sp.on_sale==='true') parts.push('on_sale=true');
    if(sp.min_price) parts.push(`min_price=${sp.min_price}`);
    if(sp.max_price) parts.push(`max_price=${sp.max_price}`);
    if(extra) parts.push(extra);
    return parts.length?`?${parts.join('&')}`:'/shop';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

      {/* Mobile filter bar */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">All Products</h1>
          <p className="text-gray-500 text-xs">{total} products found</p>
        </div>
        <a href="/shop?on_sale=true"
          className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors
            ${sp.on_sale==='true'?'bg-[#e8197a] text-white border-[#e8197a]':'border-gray-300 text-gray-600'}`}>
          🔥 Sale
        </a>
      </div>

      {/* Mobile sort row */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 lg:hidden scrollbar-hide">
        {SORT_OPTIONS.map(s=>(
          <a key={`${s.orderby}-${s.order}`}
            href={`/shop?orderby=${s.orderby}&order=${s.order}${sp.category?`&category=${sp.category}`:''}`}
            className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors
              ${orderby===s.orderby&&order===s.order
                ?'bg-[#e8197a] text-white border-[#e8197a]'
                :'border-gray-200 text-gray-600 bg-white hover:border-[#e8197a] hover:text-[#e8197a]'}`}>
            {s.label}
          </a>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0 space-y-6">
          <div>
            <h3 className="font-bold text-[#1a1a2e] text-xs uppercase tracking-wide mb-3">Sort By</h3>
            <div className="space-y-1">
              {SORT_OPTIONS.map(s=>(
                <a key={`${s.orderby}-${s.order}`}
                  href={`/shop?orderby=${s.orderby}&order=${s.order}${sp.category?`&category=${sp.category}`:''}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors
                    ${orderby===s.orderby&&order===s.order
                      ?'bg-[#e8197a] text-white'
                      :'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1a1a2e] text-xs uppercase tracking-wide mb-3">Category</h3>
            <div className="space-y-1">
              {[{name:'All',id:'',slug:''},...categories.slice(0,15)].map(c=>(
                <a key={c.id||'all'}
                  href={`/shop${c.id?`?category=${c.id}`:''}${(c.id&&sp.orderby)?`&orderby=${sp.orderby}&order=${sp.order||'desc'}`:(!c.id&&sp.orderby)?`?orderby=${sp.orderby}&order=${sp.order||'desc'}`:''}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${sp.category===String(c.id)?'bg-[#e8197a] text-white':'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}>
                  {decodeHtml(c.name)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[#1a1a2e] text-xs uppercase tracking-wide mb-3">Offers</h3>
            <a href={`/shop${sp.on_sale==='true'?'':'?on_sale=true'}`}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${sp.on_sale==='true'?'bg-[#e8197a] text-white':'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}>
              🔥 On Sale Only
            </a>
          </div>

          <div>
            <h3 className="font-bold text-[#1a1a2e] text-xs uppercase tracking-wide mb-3">Price</h3>
            {[
              {l:'Under ৳500',min:'',max:'500'},
              {l:'৳500–৳1,000',min:'500',max:'1000'},
              {l:'৳1,000–৳2,000',min:'1000',max:'2000'},
              {l:'Above ৳2,000',min:'2000',max:''},
            ].map(p=>(
              <a key={p.l} href={`/shop?min_price=${p.min}&max_price=${p.max}`}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${sp.min_price===p.min&&sp.max_price===p.max?'bg-[#e8197a] text-white':'text-gray-600 hover:bg-[#fce7f0] hover:text-[#e8197a]'}`}>
                {p.l}
              </a>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Desktop header */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">All Products</h1>
              <p className="text-gray-500 text-sm">{total} products found</p>
            </div>
          </div>

          {products.length>0?(
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {products.map(p=><ProductCard key={p.id} product={p}/>)}
              </div>

              {/* Pagination */}
              {totalPages>1&&(
                <div className="flex justify-center gap-2 mt-10 flex-wrap">
                  {page>1&&(
                    <a href={`/shop?page=${page-1}${sp.category?`&category=${sp.category}`:''}`}
                      className="px-4 h-10 flex items-center rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:border-[#e8197a] hover:text-[#e8197a]">
                      ← Prev
                    </a>
                  )}
                  {Array.from({length:Math.min(totalPages,7)},(_,i)=>{
                    const p=i+1;
                    return(
                      <a key={p} href={`/shop?page=${p}${sp.category?`&category=${sp.category}`:''}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-colors
                          ${p===page?'bg-[#e8197a] text-white border-[#e8197a]':'border-gray-200 text-gray-600 hover:border-[#e8197a] hover:text-[#e8197a]'}`}>
                        {p}
                      </a>
                    );
                  })}
                  {page<totalPages&&(
                    <a href={`/shop?page=${page+1}${sp.category?`&category=${sp.category}`:''}`}
                      className="px-4 h-10 flex items-center rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:border-[#e8197a] hover:text-[#e8197a]">
                      Next →
                    </a>
                  )}
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
