'use client';

import dynamic from 'next/dynamic';

const ResultPage = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function DetachResultPage() {
  return <ResultPage />;
}
