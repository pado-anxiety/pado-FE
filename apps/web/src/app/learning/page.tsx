'use client';

import dynamic from 'next/dynamic';

const LearningView = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function LearningPage() {
  return <LearningView />;
}
