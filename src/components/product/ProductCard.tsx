'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getDiscountPercent, isInStock, decodeHtml } from '@/lib/woocommerce';
import type { WooProduct } from '@/lib/woocommerce';
import toast from 'react-hot-toast';

export default function ProductCard({ product }:{ product:WooProduct }) {
  const addItem = useCartStore(s=>s.addItem);
  const openCart = useCartStore(s=>s.openCart);
  const discount = product.on_sale ? getDiscountPercent(product.regular_price, product.sale_price) : 0;
  const inStock = isInStock(product);
  const name = decodeHtml(product.name);

  return (
    <div className="group card relative overflow-hidden flex flex-col">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {discount>0&&<span className="badge-sale">-{discount}%</span>}
        {!inStock&&<span className="badge-new bg-gray-400 text-[10px]">Sold Out</span>}
      </div>
      <button
        onClick={e=>{ e.preventDefault(); toast('Wishlist coming soon! 💝',{icon:'💝'}); }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#e8197a]">
        <Heart size={14}/>
      </button>

      <Link href={`/shop/${product.slug}`} className="flex-1 flex flex-col">
        <div className="product-img-wrap rounded-t-2xl overflow-hidden">
          {product.images[0]?(
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt||name}
              fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"/>
          ):(
            <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gray-50">🧴</div>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col">
          {product.categories[0]&&(
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide truncate">
              {decodeHtml(product.categories[0].name)}
            </p>
          )}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mt-0.5 line-clamp-2 leading-snug flex-1">{name}</h3>
          {parseFloat(product.average_rating)>0&&(
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">{[...Array(5)].map((_,i)=>(
                <svg key={i} width="10" height="10" viewBox="0 0 24 24"
                  fill={i<Math.round(parseFloat(product.average_rating))?'#f59e0b':'#e5e7eb'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}</div>
              <span className="text-[9px] text-gray-400">({product.rating_count})</span>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-extrabold text-[#e8197a]">
              {formatPrice(product.sale_price||product.price)}
            </span>
            {product.on_sale&&product.regular_price&&(
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.regular_price)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <button
          onClick={()=>{
            if(!inStock) return;
            addItem(product);
            openCart();
            toast.success('Added to cart! 🛍️');
          }}
          disabled={!inStock}
          className="w-full flex items-center justify-center gap-1.5 bg-[#e8197a] text-white text-xs sm:text-sm font-semibold
                     py-2 sm:py-2.5 rounded-xl hover:bg-[#c01264] active:scale-95 transition-all
                     disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed">
          <ShoppingCart size={14}/>{inStock?'Add to Cart':'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
