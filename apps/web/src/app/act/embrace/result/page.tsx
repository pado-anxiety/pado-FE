'use client';

import dynamic from 'next/dynamic';

const EmbraceResultView = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function EmbraceResultPage() {
  return <EmbraceResultView />;
}
