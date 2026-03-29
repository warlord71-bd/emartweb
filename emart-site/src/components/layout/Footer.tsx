// src/components/layout/Footer.tsx
import Link from 'next/link';

const SHOP=[{l:'All Products',h:'/shop'},{l:'Face Care',h:'/category/face-care'},{l:'Sunscreen & SPF',h:'/category/sunscreen'},{l:'Serum & Toner',h:'/category/serum-toner'},{l:'Moisturizer',h:'/category/moisturizer'},{l:'Cleanser',h:'/category/cleanser'},{l:'Hair Care',h:'/category/hair-care'},{l:'🔥 Sale',h:'/sale'},{l:'✨ New Arrivals',h:'/new-arrivals'}];
const HELP=[{l:'My Account',h:'/account'},{l:'Track My Order',h:'/track-order'},{l:'Return & Refund',h:'/return-policy'},{l:'Shipping Policy',h:'/shipping-policy'},{l:'FAQ',h:'/faq'},{l:'Privacy Policy',h:'/privacy-policy'},{l:'Contact Us',h:'/contact'},{l:'About Us',h:'/about-us'}];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-[#e8197a] to-[#c01264] rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">E</span>
            </div>
            <div>
              <div className="font-extrabold text-[#1a1a2e]">Emart Skincare</div>
              <div className="text-[#e8197a] text-[9px] font-bold tracking-widest uppercase">Bangladesh</div>
            </div>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">Bangladesh's #1 destination for authentic Korean & Japanese skincare. Every product 100% genuine.</p>
          <div className="flex gap-2">
            {[
              {href:'https://www.facebook.com/emartbd.official',bg:'#1877f2',path:'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'},
              {href:'https://wa.me/8801919797399',bg:'#25d366',path:'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z'},
              {href:'https://t.me/emart_official',bg:'#2aabee',path:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.57-.45.71-.91.44l-2.52-1.86-1.22 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1L7.39 14.6 4.9 13.84c-.56-.17-.57-.56.12-.83l10.38-4c.47-.17.88.11.74.83z'},
            ].map((s,i)=>(
              <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                 className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                 style={{background:s.bg}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d={s.path}/></svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-4 pb-2 border-b-2 border-[#e8197a] inline-block">Shop</h3>
          <ul className="space-y-2">{SHOP.map(l=><li key={l.h}><Link href={l.h} className="text-sm text-gray-500 hover:text-[#e8197a] transition-colors">{l.l}</Link></li>)}</ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-4 pb-2 border-b-2 border-[#e8197a] inline-block">Help</h3>
          <ul className="space-y-2">{HELP.map(l=><li key={l.h}><Link href={l.h} className="text-sm text-gray-500 hover:text-[#e8197a] transition-colors">{l.l}</Link></li>)}</ul>
          <div className="mt-4 p-4 bg-[#fce7f0] rounded-xl border border-[#f0a8c8]">
            <div className="font-bold text-[#1a1a2e] text-sm mb-1">🏪 Wholesale / B2B</div>
            <div className="text-xs text-gray-500 mb-2">Korean & Japanese cosmetics for retailers across Bangladesh</div>
            <a href="https://kcoswbd.com" target="_blank" rel="noopener noreferrer" className="text-xs bg-[#e8197a] text-white px-3 py-1.5 rounded-lg font-semibold inline-block">Visit kcoswbd.com →</a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-[#1a1a2e] text-sm uppercase tracking-wide mb-4 pb-2 border-b-2 border-[#e8197a] inline-block">Contact</h3>
          <div className="space-y-3 text-sm text-gray-500">
            <div>📍 17, Central Road (Near Ideal College)<br/>Dhanmondi, Dhaka-1205</div>
            <div>📞 <a href="tel:+8809697597399" className="text-[#e8197a] font-semibold">+880 9697-597399</a></div>
            <div>📞 <a href="tel:+8801919797399" className="text-[#e8197a] font-semibold">+880 1919-797399</a></div>
            <div>✉️ <a href="mailto:emart.bdofficial@gmail.com" className="text-[#e8197a] text-xs">emart.bdofficial@gmail.com</a></div>
            <div>🕘 Sat–Thu: 9AM – 9PM BST</div>
            <div className="pt-1">
              <div className="text-xs font-semibold text-gray-600 mb-1">Payment:</div>
              <div className="text-xs">bKash: <strong className="text-[#e2136e]">01919-797399</strong></div>
              <div className="text-xs">Nagad: <strong className="text-[#f26522]">01919-797399</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Bar */}
      <div className="border-t border-gray-100 bg-gray-50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-400 uppercase">We Accept:</span>
            {['bkash','nagad','rocket','visa','mastercard','cod'].map(icon=>(
              <img key={icon} src={`/images/payment/${icon}.svg`} alt={icon} style={{height:'26px',borderRadius:'4px',boxShadow:'0 1px 3px rgba(0,0,0,0.12)'}}/>
            ))}
          </div>
          <div className="flex gap-3 text-xs text-gray-400">
            <span>🚚 Free ৳3,000+</span><span>⚡ Dhaka Next Day</span><span>🇧🇩 Nationwide</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-[#252538] text-gray-400 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <p>© 2025 <Link href="/" className="text-[#e8197a] font-semibold">Emart Skincare Bangladesh</Link>. All rights reserved.</p>
          <div className="flex gap-4">
            {[{l:'Privacy',h:'/privacy-policy'},{l:'Terms',h:'/terms-conditions'},{l:'Returns',h:'/return-policy'},{l:'Sitemap',h:'/sitemap_index.xml'}].map(l=>(
              <Link key={l.h} href={l.h} className="hover:text-[#e8197a] transition-colors text-xs">{l.l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
