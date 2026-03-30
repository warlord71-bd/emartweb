// src/app/not-found.tsx
import Link from 'next/link';
export default function NotFound(){
  return(
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-7xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary inline-block">Go Home →</Link>
    </div>
  );
}
