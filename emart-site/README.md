# EMART BD — Next.js Site
## Ready to Publish Guide

### ── STEP 1: Install Node.js ──
Download from: https://nodejs.org (v18 or higher)

### ── STEP 2: Setup Project ──
```bash
# Extract the zip, open terminal inside folder
npm install
```

### ── STEP 3: Add API Keys ──
1. Copy `.env.local.example` → rename to `.env.local`
2. Go to WP Admin → WooCommerce → Settings → Advanced → REST API
3. Click "Add Key" → Read/Write → Copy Consumer Key & Secret
4. Paste into `.env.local`:

```
NEXT_PUBLIC_WOO_URL=https://e-mart.com.bd
WOO_CONSUMER_KEY=ck_your_key_here
WOO_CONSUMER_SECRET=cs_your_secret_here
NEXTAUTH_SECRET=any-random-32-char-string
```

### ── STEP 4: Test Locally ──
```bash
npm run dev
# Open: http://localhost:3000
```

### ── STEP 5: Build for Production ──
```bash
npm run build
npm run start
```

### ── STEP 6: Deploy to Vercel (FREE) ──
```bash
npm install -g vercel
vercel
# Follow prompts, add env variables in Vercel dashboard
```

OR deploy to Vercel via GitHub:
1. Push to GitHub
2. Go to vercel.com → Import Project → Add env vars → Deploy

### ── PAGES INCLUDED ──
- / → Homepage (Hero + Categories + Featured + Sale)
- /shop → All products with filters
- /shop/[slug] → Single product page
- /category/[slug] → Category page
- /search → Search results
- /cart → Cart page
- /checkout → Checkout (COD + bKash + Nagad)
- /order-success → Order confirmation

### ── FEATURES ──
✅ WooCommerce REST API connected
✅ Real products from your store
✅ Cart with persistent localStorage
✅ COD, bKash, Nagad payment
✅ Mobile-first responsive
✅ SEO optimized (metadata, OG tags)
✅ Mobile bottom navigation
✅ Search functionality
✅ Category filters
✅ Price range filter
✅ Sale badge & stock status
✅ Product gallery with thumbnails
✅ Free delivery threshold notice

### ── CUSTOMIZATION ──
- Colors: edit `tailwind.config.ts` (pk: '#e8197a')
- Logo: replace `public/images/logo.png`
- Contact info: edit `src/components/layout/Footer.tsx`
- Payment numbers: edit `src/app/checkout/page.tsx`

### ── NEED HELP? ──
WhatsApp: 01919-797399
