'use client';

import { ErrorBoundary } from 'react-error-boundary';

import { DescriptionList, Divide, ErrorFallback } from '../../ui';
import PageLayout from '../../ui/layout';
import ActIntroButton from './ActIntroButton';
import ActIntroContent from './ActIntroContent';
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

interface ActIntroPageContentProps {
  contentTitle: string;
  contentDescription: string;
  steps: string[];
  tipText: string;
  buttonText: string;
  onStart: () => void;
}

const ActIntroPageContent = ({
  contentTitle,
  contentDescription,
  steps,
  tipText,
  buttonText,
  onStart,
}: ActIntroPageContentProps) => {
  return (
    <ErrorBoundary fallbackRender={() => <ErrorFallback />}>
      <ActIntroContent
        contentTitle={contentTitle}
        contentDescription={contentDescription}
        steps={steps}
        tipText={tipText}
      />
      <ActIntroButton
        buttonText={buttonText}
        onStart={onStart}
      />
    </ErrorBoundary>
  );
};

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
          <DescriptionList
            items={description}
            itemClassName="text-body-small"
          />
        </div>

        <Divide />

        <ActIntroPageContent
          contentTitle={contentTitle}
          contentDescription={contentDescription}
          steps={steps}
          tipText={tipText}
          buttonText={buttonText}
          onStart={onStart}
        />
      </div>
    </PageLayout>
  );
}

export default ActIntroPage;
