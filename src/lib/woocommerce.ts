// src/lib/woocommerce.ts
import axios from 'axios';

const WOO_URL = process.env.NEXT_PUBLIC_WOO_URL || 'https://e-mart.com.bd';
const wooClient = axios.create({
  baseURL: `${WOO_URL}/wp-json/wc/v3`,
  auth: { username: process.env.WOO_CONSUMER_KEY||'', password: process.env.WOO_CONSUMER_SECRET||'' },
  timeout: 15000,
});

export interface WooProduct {
  id: number; name: string; slug: string; permalink: string;
  price: string; regular_price: string; sale_price: string;
  on_sale: boolean; purchasable: boolean;
  stock_status: 'instock'|'outofstock'|'onbackorder'; stock_quantity: number|null;
  description: string; short_description: string;
  images: { id:number; src:string; name:string; alt:string }[];
  categories: { id:number; name:string; slug:string }[];
  attributes: { id:number; name:string; options:string[] }[];
  average_rating: string; rating_count: number; featured: boolean;
}
export interface WooCategory {
  id:number; name:string; slug:string;
  image?:{src:string;alt:string}; count?:number; parent?:number;
}
export interface WooBilling {
  first_name:string; last_name:string; address_1:string; address_2:string;
  city:string; postcode:string; country:string; phone:string; email:string;
}
export interface WooOrder {
  id:number; status:string; total:string;
  line_items:{id:number;name:string;product_id:number;quantity:number;total:string}[];
  billing:WooBilling; date_created:string; order_key:string;
}

export interface ProductsParams {
  page?:number; per_page?:number; search?:string; category?:string;
  orderby?:'date'|'price'|'popularity'|'rating'|'title'; order?:'asc'|'desc';
  on_sale?:boolean; featured?:boolean; min_price?:string; max_price?:string;
  exclude?:string; status?:string;
}

export async function getProducts(params:ProductsParams={}):Promise<{products:WooProduct[];total:number;totalPages:number}> {
  try {
    const r = await wooClient.get('/products',{params:{per_page:20,status:'publish',...params}});
    return {products:r.data,total:parseInt(r.headers['x-wp-total']||'0'),totalPages:parseInt(r.headers['x-wp-totalpages']||'0')};
  } catch { return {products:[],total:0,totalPages:0}; }
}
export async function getProduct(slug:string):Promise<WooProduct|null> {
  console.log('[getProduct] fetching slug:', slug);
  try { const r=await wooClient.get('/products',{params:{slug,status:'publish'}}); return r.data[0]||null; }
  catch(e) { console.error('[getProduct] error:', e); return null; }
}
export async function getFeaturedProducts(limit=8):Promise<WooProduct[]> {
  const {products}=await getProducts({featured:true,per_page:limit,orderby:'popularity',order:'desc'}); return products;
}
export async function getSaleProducts(limit=8):Promise<WooProduct[]> {
  const {products}=await getProducts({on_sale:true,per_page:limit}); return products;
}
export async function searchProducts(q:string,page=1) {
  return getProducts({search:q,page,per_page:20});
}
export async function getCategories(params:{per_page?:number;parent?:number;hide_empty?:boolean}={}):Promise<WooCategory[]> {
  try { const r=await wooClient.get('/products/categories',{params:{per_page:100,hide_empty:true,orderby:'count',order:'desc',...params}}); return r.data; }
  catch { return []; }
}
export async function getCategoryBySlug(slug:string):Promise<WooCategory|null> {
  try { const r=await wooClient.get('/products/categories',{params:{slug}}); return r.data[0]||null; }
  catch { return null; }
}
export async function createOrder(data:{
  payment_method:string; billing:WooBilling; shipping:WooBilling;
  line_items:{product_id:number;quantity:number}[]; customer_note?:string;
}):Promise<WooOrder|null> {
  try { const r=await wooClient.post('/orders',{...data,currency:'BDT',status:'pending'}); return r.data; }
  catch { return null; }
}
export function formatPrice(price:string):string {
  const n=parseFloat(price); if(isNaN(n)) return '৳0';
  return `৳${n.toLocaleString('en-BD')}`;
}
export function getDiscountPercent(regular:string,sale:string):number {
  const r=parseFloat(regular),s=parseFloat(sale); if(!r||!s) return 0;
  return Math.round(((r-s)/r)*100);
}
export function isInStock(p:WooProduct):boolean { return p.stock_status==='instock'&&p.purchasable; }
