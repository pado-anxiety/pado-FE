'use client';

import { Divide } from '../../ui';
import PageLayout from '../../ui/layout';
import ActIntroButton from './ActIntroButton';
import ActIntroContent from './ActIntroContent';
import ActIntroDescription from './ActIntroDescription';
import ActIntroHeader from './ActIntroHeader';

interface ActIntroPageProps {
  title: string;
  description: string[];
  contentTitle: string;
  contentDescription: string;
  steps: string[];
  tipText: string;
  buttonText: string;
  onStart: () => void;
  onClose: () => void;
}

function ActIntroPage({
  title,
  description,
  contentTitle,
  contentDescription,
  steps,
  tipText,
  buttonText,
  onStart,
  onClose,
}: ActIntroPageProps) {
  return (
    <PageLayout className="bg-act-page pt-4">
      <div className="flex flex-col flex-1 justify-between gap-4">
        {/* 헤더 및 메인 설명 */}
        <div className="flex flex-col gap-3">
          <ActIntroHeader
            title={title}
            onClose={onClose}
          />
          <ActIntroDescription description={description} />
        </div>

        <Divide />

        {/* 스크롤 가능한 컨텐츠 */}
        <ActIntroContent
          contentTitle={contentTitle}
          contentDescription={contentDescription}
          steps={steps}
          tipText={tipText}
        />

        {/* 하단 버튼 */}
        <ActIntroButton
          buttonText={buttonText}
          onStart={onStart}
        />
      </div>
    </PageLayout>
  );
}

export default ActIntroPage;
