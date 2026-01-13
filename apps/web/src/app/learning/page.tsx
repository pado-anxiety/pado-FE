'use client';

import dynamic from 'next/dynamic';

import { Loading } from '@/components/ui';

const LearningView = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center">
      <Loading />
    </div>
  ),
});

export default function LearningPage() {
  return <LearningView />;
}
