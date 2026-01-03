'use client';

import dynamic from 'next/dynamic';

import PageLayout from '@/components/ui/layout';

const ResultPage = dynamic(() => import('./View'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function DetachResultPage() {
  return (
    <PageLayout className="bg-act-page">
      <ResultPage />
    </PageLayout>
  );
}
