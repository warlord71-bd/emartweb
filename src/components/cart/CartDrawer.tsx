'use client';
// src/components/cart/CartDrawer.tsx
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Trash2, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, decodeHtml, wooCartUrl } from '@/lib/woocommerce';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();

  useEffect(()=>{ const h=(e:KeyboardEvent)=>{ if(e.key==='Escape') closeCart(); }; window.addEventListener('keydown',h); return()=>window.removeEventListener('keydown',h); },[closeCart]);
  useEffect(()=>{ document.body.style.overflow=isOpen?'hidden':''; return()=>{ document.body.style.overflow=''; }; },[isOpen]);

  if(!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeCart}/>
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#e8197a]"/>
            <h2 className="font-bold text-[#1a1a2e]">My Cart ({totalItems()})</h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length===0?(
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <button onClick={closeCart} className="mt-4 text-[#e8197a] font-semibold hover:underline">Continue Shopping →</button>
            </div>
          ):(
            <div className="space-y-4">
              {items.map(item=>(
                <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <Link href={`/shop/${item.slug}`} onClick={closeCart}>
                    <div className="w-16 h-16 relative flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover"/>
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/${item.slug}`} onClick={closeCart} className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#e8197a]">
                      {decodeHtml(item.name)}
                    </Link>
                    <div className="text-[#e8197a] font-bold text-sm mt-1">{formatPrice(item.price)}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={()=>updateQuantity(item.id,item.quantity-1)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-full hover:border-[#e8197a] hover:text-[#e8197a]"><Minus size={11}/></button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={()=>updateQuantity(item.id,item.quantity+1)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-full hover:border-[#e8197a] hover:text-[#e8197a]"><Plus size={11}/></button>
                      <button onClick={()=>removeItem(item.id)} className="ml-auto p-1 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length>0&&(
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            {totalPrice()<3000&&(
              <div className="text-xs text-center text-gray-500 mb-3 bg-[#fce7f0] px-3 py-2 rounded-xl">
                Add <strong className="text-[#e8197a]">{formatPrice(String(3000-totalPrice()))}</strong> more for free delivery 🚚
              </div>
            )}
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-gray-700">Subtotal</span>
              <span className="font-bold text-xl text-[#e8197a]">{formatPrice(String(totalPrice()))}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="w-full btn-primary text-center block">
              Proceed to Checkout →
            </Link>
            <a href={wooCartUrl(items.map(i=>({id:i.id,quantity:i.quantity})))}
              className="w-full flex items-center justify-center gap-1.5 mt-2 border-2 border-[#e8197a]
                         text-[#e8197a] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#e8197a] hover:text-white transition-all">
              <Zap size={14}/>⚡ Express Checkout
            </a>
            <Link href="/cart" onClick={closeCart}
              className="w-full text-center block mt-2 text-sm text-gray-500 hover:text-[#e8197a]">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
