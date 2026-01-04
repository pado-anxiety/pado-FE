'use client';

import dynamic from 'next/dynamic';

import PageLayout from '@/components/ui/layout';

const ResultPage = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function DiaryResultPage() {
  return (
    <PageLayout className="bg-act-page overflow-y-auto scrollbar-hide">
      <ResultPage />
    </PageLayout>
  );
}
