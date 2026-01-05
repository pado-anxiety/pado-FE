'use client';

import dynamic from 'next/dynamic';

const EmbraceStepView = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function EmbraceStepPage() {
  return <EmbraceStepView />;
}
