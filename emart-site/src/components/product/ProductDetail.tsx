'use client';
// src/components/product/ProductDetail.tsx
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getDiscountPercent, isInStock } from '@/lib/woocommerce';
import type { WooProduct } from '@/lib/woocommerce';
import toast from 'react-hot-toast';

export default function ProductDetail({product}:{product:WooProduct}) {
  const [qty,setQty]=useState(1);
  const [activeImg,setActiveImg]=useState(0);
  const addItem=useCartStore(s=>s.addItem);
  const openCart=useCartStore(s=>s.openCart);
  const inStock=isInStock(product);
  const discount=product.on_sale?getDiscountPercent(product.regular_price,product.sale_price):0;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            {product.images[activeImg]?(
              <Image src={product.images[activeImg].src} alt={product.images[activeImg].alt||product.name}
                fill className="object-cover" priority sizes="(max-width:768px) 100vw,50vw"/>
            ):(
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🧴</div>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount>0&&<span className="badge-sale text-sm px-3 py-1">-{discount}%</span>}
              {!inStock&&<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-500 text-white">Out of Stock</span>}
            </div>
            <button onClick={async()=>{ try{await navigator.share({title:product.name,url:window.location.href})}catch{await navigator.clipboard.writeText(window.location.href);toast.success('Link copied!');} }}
              className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:text-[#e8197a]"><Share2 size={17}/></button>
          </div>
          {product.images.length>1&&(
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img,i)=>(
                <button key={img.id} onClick={()=>setActiveImg(i)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i===activeImg?'border-[#e8197a]':'border-transparent hover:border-gray-300'}`}>
                  <Image src={img.src} alt={img.alt||''} fill className="object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {product.categories[0]&&<div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{product.categories.map(c=>c.name).join(' › ')}</div>}
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] leading-tight">{product.name}</h1>

          {parseFloat(product.average_rating)>0&&(
            <div className="flex items-center gap-2">
              <div className="flex">{[...Array(5)].map((_,i)=>(
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i<Math.round(parseFloat(product.average_rating))?'#f59e0b':'#e5e7eb'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}</div>
              <span className="text-sm text-gray-500">{product.average_rating} ({product.rating_count} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-[#e8197a]">{formatPrice(product.sale_price||product.price)}</span>
            {product.on_sale&&product.regular_price&&<span className="text-xl text-gray-400 line-through">{formatPrice(product.regular_price)}</span>}
            {discount>0&&<span className="badge-sale">Save {discount}%</span>}
          </div>

          {product.short_description&&(
            <div className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html:product.short_description}}/>
          )}

          <div className={`flex items-center gap-2 text-sm font-medium ${inStock?'text-green-600':'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${inStock?'bg-green-500':'bg-red-500'}`}/>
            {inStock?(product.stock_quantity?`In Stock (${product.stock_quantity} left)`:'In Stock'):'Out of Stock'}
          </div>

          {inStock&&(
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Qty:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={()=>setQty(q=>Math.max(1,q-1))} className="px-4 py-2 hover:bg-gray-100 text-xl">−</button>
                  <span className="px-4 py-2 font-bold min-w-[3rem] text-center">{qty}</span>
                  <button onClick={()=>setQty(q=>q+1)} className="px-4 py-2 hover:bg-gray-100 text-xl">+</button>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={()=>{addItem(product,qty);openCart();toast.success('Added to cart! 🛍️');}}
                  className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <ShoppingCart size={18}/>Add to Cart
                </button>
                <button className="p-3 border-2 border-gray-200 rounded-xl hover:border-[#e8197a] hover:text-[#e8197a] transition-colors"><Heart size={20}/></button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
            {[{icon:Shield,l:'100% Authentic',s:'Genuine products'},{icon:Truck,l:'Fast Delivery',s:'COD nationwide'},{icon:RotateCcw,l:'Easy Returns',s:'7-day policy'}].map(({icon:Icon,l,s})=>(
              <div key={l} className="text-center p-3 bg-gray-50 rounded-xl">
                <Icon size={18} className="mx-auto text-[#e8197a] mb-1"/>
                <div className="text-xs font-semibold text-gray-700">{l}</div>
                <div className="text-[10px] text-gray-400">{s}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#fce7f0] rounded-2xl p-4 space-y-1.5">
            <p className="text-sm font-bold text-[#1a1a2e]">💳 Payment Options</p>
            <p className="text-xs text-gray-600">💵 Cash on Delivery (COD) — Pay when you receive</p>
            <p className="text-xs text-gray-600">bKash: <strong className="text-[#e2136e]">01919-797399</strong> &nbsp;|&nbsp; Nagad: <strong className="text-[#f26522]">01919-797399</strong></p>
            <p className="text-xs text-gray-600">VISA / Mastercard / Rocket / Upay accepted</p>
          </div>

          {product.attributes.length>0&&(
            <div className="space-y-2 border-t border-gray-100 pt-4">
              {product.attributes.map(a=>(
                <div key={a.id} className="flex gap-2 text-sm">
                  <span className="font-medium text-gray-600 min-w-[80px]">{a.name}:</span>
                  <span className="text-gray-500">{a.options.join(', ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {product.description&&(
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Product Description</h2>
          <div className="prose prose-gray max-w-none text-sm leading-relaxed" dangerouslySetInnerHTML={{__html:product.description}}/>
        </div>
      )}
    </div>
  );
}
