'use client';
// src/app/checkout/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { createOrder, formatPrice } from '@/lib/woocommerce';
import toast from 'react-hot-toast';

const DISTRICTS=['Dhaka','Chittagong','Rajshahi','Khulna','Sylhet','Barisal','Rangpur','Mymensingh','Gazipur','Narayanganj','Comilla','Narsingdi','Tangail','Bogura','Jessore','Faridpur','Manikganj','Munshiganj','Shariatpur','Madaripur'];

const PAY=[
  {id:'cod',label:'💵 Cash on Delivery',desc:'Pay when you receive your order',color:'green'},
  {id:'bkash',label:'🩷 bKash',desc:'Send to 01919-797399 (Merchant)',number:'01919-797399'},
  {id:'nagad',label:'📱 Nagad',desc:'Send to 01919-797399 (Merchant)',number:'01919-797399'},
];

export default function CheckoutPage(){
  const router=useRouter();
  const {items,totalPrice,totalItems,clearCart}=useCartStore();
  const [pay,setPay]=useState('cod');
  const [loading,setLoading]=useState(false);
  const [txn,setTxn]=useState('');
  const [form,setForm]=useState({first_name:'',last_name:'',phone:'',email:'',address_1:'',city:'Dhaka',note:''});
  const ch=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setForm(p=>({...p,[e.target.name]:e.target.value}));

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(items.length===0) return;
    if(!form.phone.match(/^(\+880|880|0)1[3-9]\d{8}$/)){toast.error('Valid Bangladesh phone required');return;}
    if(pay!=='cod'&&!txn.trim()){toast.error('Please enter Transaction ID');return;}
    setLoading(true);
    try{
      const billing={first_name:form.first_name,last_name:form.last_name,address_1:form.address_1,address_2:'',city:form.city,postcode:'',country:'BD',phone:form.phone,email:form.email||`${form.phone}@emart.bd`};
      const order=await createOrder({
        payment_method:pay,billing,shipping:billing,
        line_items:items.map(i=>({product_id:i.id,quantity:i.quantity})),
        customer_note:[form.note,pay!=='cod'?`TxnID: ${txn}`:''].filter(Boolean).join(' | '),
      });
      if(order){clearCart();toast.success('Order placed! 🎉');router.push(`/order-success?id=${order.id}`);}
      else throw new Error();
    }catch{toast.error('Something went wrong. Please call us: 01919-797399');}
    finally{setLoading(false);}
  };

  if(totalItems()===0) return(
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Your cart is empty</h2>
      <a href="/shop" className="btn-primary inline-block mt-4">Shop Now →</a>
    </div>
  );

  return(
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">Checkout</h1>
      <form onSubmit={submit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a1a2e] text-lg mb-5">📦 Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{n:'first_name',l:'First Name',r:true},{n:'last_name',l:'Last Name',r:true}].map(f=>(
                  <div key={f.n}>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">{f.l}{f.r&&<span className="text-red-500"> *</span>}</label>
                    <input name={f.n} value={(form as any)[f.n]} onChange={ch} required={f.r} className="input-field"/>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input name="phone" type="tel" value={form.phone} onChange={ch} required placeholder="01XXXXXXXXX" className="input-field"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                  <input name="address_1" value={form.address_1} onChange={ch} required placeholder="House no, Road, Area" className="input-field"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">District <span className="text-red-500">*</span></label>
                  <select name="city" value={form.city} onChange={ch} required className="input-field">
                    {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Email (optional)</label>
                  <input name="email" type="email" value={form.email} onChange={ch} placeholder="For order confirmation" className="input-field"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Order Note (optional)</label>
                  <textarea name="note" value={form.note} onChange={ch} rows={2} placeholder="Special delivery instructions..." className="input-field resize-none"/>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-[#1a1a2e] text-lg mb-5">💳 Payment Method</h2>
              <div className="space-y-3">
                {PAY.map(m=>(
                  <label key={m.id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                                                ${pay===m.id?'border-[#e8197a] bg-[#fce7f0]':'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="payment" value={m.id} checked={pay===m.id} onChange={()=>setPay(m.id)} className="mt-1 accent-[#e8197a]"/>
                    <div className="flex-1">
                      <div className="font-semibold text-[#1a1a2e]">{m.label}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{m.desc}</div>
                      {pay===m.id&&m.id!=='cod'&&(
                        <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">
                            Send payment to: <strong className="text-[#e8197a]">{m.number}</strong><br/>
                            Then enter your Transaction ID:
                          </p>
                          <input type="text" value={txn} onChange={e=>setTxn(e.target.value)}
                            placeholder="e.g. 8N7G6K5M4J" className="input-field text-sm"/>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="font-bold text-[#1a1a2e] text-lg mb-5">🧾 Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto">
                {items.map(item=>(
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#e8197a] flex-shrink-0">
                      {formatPrice(String(parseFloat(item.price)*item.quantity))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({totalItems()} items)</span>
                  <span>{formatPrice(String(totalPrice()))}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className={totalPrice()>=3000?'text-green-600 font-semibold':''}>
                    {totalPrice()>=3000?'FREE 🚚':'৳60–120'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                  <span className="text-[#1a1a2e]">Total</span>
                  <span className="text-[#e8197a] text-xl">{formatPrice(String(totalPrice()+(totalPrice()>=3000?0:80)))}</span>
                </div>
              </div>
              {totalPrice()<3000&&(
                <div className="mt-3 text-xs text-center bg-[#fce7f0] px-3 py-2 rounded-xl text-gray-600">
                  Add <strong className="text-[#e8197a]">{formatPrice(String(3000-totalPrice()))}</strong> more for free delivery 🚚
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full btn-primary mt-4 flex items-center justify-center gap-2">
                {loading?(
                  <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Placing Order...</>
                ):<>✅ Place Order</>}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Need help? Call <a href="tel:+8801919797399" className="text-[#e8197a] font-semibold">01919-797399</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
