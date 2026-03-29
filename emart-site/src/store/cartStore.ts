// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WooProduct } from '@/lib/woocommerce';

export interface CartItem {
  id:number; name:string; price:string; image:string;
  quantity:number; slug:string; stock_quantity:number|null;
}
interface CartStore {
  items:CartItem[]; isOpen:boolean;
  addItem:(product:WooProduct,quantity?:number)=>void;
  removeItem:(id:number)=>void;
  updateQuantity:(id:number,quantity:number)=>void;
  clearCart:()=>void;
  openCart:()=>void; closeCart:()=>void; toggleCart:()=>void;
  totalItems:()=>number; totalPrice:()=>number;
}
export const useCartStore = create<CartStore>()(
  persist((set,get)=>({
    items:[], isOpen:false,
    addItem:(product,quantity=1)=>{
      set(state=>{
        const ex=state.items.find(i=>i.id===product.id);
        if(ex) return {items:state.items.map(i=>i.id===product.id?{...i,quantity:i.quantity+quantity}:i),isOpen:true};
        return {items:[...state.items,{
          id:product.id,name:product.name,
          price:product.sale_price||product.regular_price||product.price,
          image:product.images[0]?.src||'/images/placeholder.jpg',
          quantity,slug:product.slug,stock_quantity:product.stock_quantity,
        }],isOpen:true};
      });
    },
    removeItem:(id)=>set(s=>({items:s.items.filter(i=>i.id!==id)})),
    updateQuantity:(id,quantity)=>{
      if(quantity<=0){get().removeItem(id);return;}
      set(s=>({items:s.items.map(i=>i.id===id?{...i,quantity}:i)}));
    },
    clearCart:()=>set({items:[]}),
    openCart:()=>set({isOpen:true}),
    closeCart:()=>set({isOpen:false}),
    toggleCart:()=>set(s=>({isOpen:!s.isOpen})),
    totalItems:()=>get().items.reduce((s,i)=>s+i.quantity,0),
    totalPrice:()=>get().items.reduce((s,i)=>s+parseFloat(i.price)*i.quantity,0),
  }),{name:'emart-cart',skipHydration:true})
);
