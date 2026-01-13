'use client';

import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/ui';

import PageLayout from '../../ui/layout';
import ActResultButton from './ActResultButton';
import ActResultContent from './ActResultContent';
import ActResultDescription from './ActResultDescription';
import ActResultTitle from './ActResultTitle';

interface ActResultPageProps {
  title: string[];
  description: string[];
  children: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
}

interface ActResultPageContentProps {
  title: string[];
  description: string[];
  children: React.ReactNode;
}

const ActResultPageContent = ({
  title,
  description,
  children,
}: ActResultPageContentProps) => {
  return (
    <ErrorBoundary fallbackRender={() => <ErrorFallback />}>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <ActResultTitle title={title} />
          <ActResultDescription description={description} />
        </div>
        <ActResultContent>{children}</ActResultContent>
      </div>
    </ErrorBoundary>
  );
};

function ActResultPage({
  title,
  description,
  children,
  buttonText,
  onButtonClick,
  buttonDisabled,
}: ActResultPageProps) {
  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col flex-1 items-center w-full pt-6 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-start justify-between flex-1 gap-4 w-full pb-4">
          <ActResultPageContent
            title={title}
            description={description}
          >
            {children}
          </ActResultPageContent>
          <ActResultButton
            text={buttonText}
            onClick={onButtonClick}
            disabled={buttonDisabled}
          />
        </div>
      </div>
    </PageLayout>
  );
}

export default ActResultPage;
