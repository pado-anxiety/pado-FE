'use client';

import dynamic from 'next/dynamic';

const OnboardView = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function OnboardPage() {
  return <OnboardView />;
}
