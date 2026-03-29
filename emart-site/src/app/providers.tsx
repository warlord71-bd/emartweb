// src/app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
const qc = new QueryClient({ defaultOptions:{ queries:{ staleTime:60000,retry:1 } } });
export default function Providers({ children }:{ children:React.ReactNode }) {
  const ref = useRef(false);
  useEffect(()=>{ if(!ref.current){ useCartStore.persist.rehydrate(); ref.current=true; } },[]);
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
