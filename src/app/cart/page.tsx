'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, decodeHtml, wooCartUrl } from '@/lib/woocommerce';

export default function CartPage(){
  const {items,removeItem,updateQuantity,totalItems,totalPrice}=useCartStore();

  if(items.length===0) return(
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4"/>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Your cart is empty</h1>
      <p className="text-gray-500 mb-6">Add some products to get started</p>
      <Link href="/shop" className="btn-primary inline-block">Shop Now →</Link>
    </div>
  );

  const wooUrl = wooCartUrl(items.map(i=>({id:i.id,quantity:i.quantity})));
  const subtotal = totalPrice();
  const shipping = subtotal>=3000 ? 0 : 80;

  return(
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">My Cart ({totalItems()} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item=>(
            <div key={item.id} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <Link href={`/shop/${item.slug}`}>
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                  <Image src={item.image} alt={decodeHtml(item.name)} fill className="object-cover"/>
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${item.slug}`}
                  className="font-semibold text-gray-800 hover:text-[#e8197a] line-clamp-2 text-sm">
                  {decodeHtml(item.name)}
                </Link>
                <div className="text-[#e8197a] font-bold mt-1 text-sm">{formatPrice(item.price)}</div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={()=>updateQuantity(item.id,item.quantity-1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"><Minus size={14}/></button>
                    <span className="px-4 py-1.5 font-bold text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                    <button onClick={()=>updateQuantity(item.id,item.quantity+1)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"><Plus size={14}/></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#e8197a] text-sm">
                      {formatPrice(String(parseFloat(item.price)*item.quantity))}
                    </span>
                    <button onClick={()=>removeItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit sticky top-24">
          <h2 className="font-bold text-[#1a1a2e] text-lg mb-5">Order Summary</h2>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal ({totalItems()} items)</span>
              <span>{formatPrice(String(subtotal))}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className={subtotal>=3000?'text-green-600 font-semibold':''}>
                {subtotal>=3000?'FREE 🚚':'৳60–120'}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-100">
              <span>Total</span>
              <span className="text-[#e8197a]">{formatPrice(String(subtotal+shipping))}</span>
            </div>
          </div>

          {subtotal<3000&&(
            <div className="text-xs text-center bg-[#fce7f0] px-3 py-2 rounded-xl text-gray-600 mb-4">
              Add <strong className="text-[#e8197a]">{formatPrice(String(3000-subtotal))}</strong> more for free delivery 🚚
            </div>
          )}

          {/* Primary: Custom checkout (COD / bKash / Nagad) */}
          <Link href="/checkout" className="w-full btn-primary text-center block">
            Proceed to Checkout →
          </Link>

          {/* Secondary: Express checkout via WooCommerce */}
          <a href={wooUrl}
            className="w-full flex items-center justify-center gap-2 mt-3 border-2 border-[#e8197a]
                       text-[#e8197a] font-semibold py-3 rounded-xl hover:bg-[#e8197a] hover:text-white transition-all text-sm">
            <Zap size={16}/>⚡ Checkout on e-mart.com.bd
          </a>

          <Link href="/shop"
            className="w-full text-center block mt-3 text-sm text-gray-500 hover:text-[#e8197a] transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
