'use client';

import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/ui';

import PageLayout from '../../ui/layout';
import ActStepButton from './ActStepButton';
import ActStepContent from './ActStepContent';
import ActStepHeader from './ActStepHeader';

interface ActStepPageProps {
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  children: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  scrollable?: boolean;
}

interface ActStepPageContentProps {
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  children: React.ReactNode;
}

const ActStepPageContent = ({
  buttonText,
  onButtonClick,
  buttonDisabled,
  children,
}: ActStepPageContentProps) => {
  return (
    <ErrorBoundary fallbackRender={() => <ErrorFallback />}>
      <div className="flex flex-col w-full flex-1 justify-between gap-4">
        <ActStepContent>{children}</ActStepContent>
        <ActStepButton
          text={buttonText}
          onClick={onButtonClick}
          disabled={buttonDisabled}
        />
      </div>
    </ErrorBoundary>
  );
};

function ActStepPage({
  leftButton,
  rightButton,
  children,
  buttonText,
  onButtonClick,
  buttonDisabled,
  scrollable = false,
}: ActStepPageProps) {
  return (
    <PageLayout
      className={`bg-act-page ${scrollable ? 'overflow-y-auto scrollbar-hide' : ''}`}
    >
      <div className="flex flex-col w-full flex-1 justify-between gap-2">
        <ActStepHeader
          leftButton={leftButton}
          rightButton={rightButton}
        />
        <ActStepPageContent
          buttonText={buttonText}
          onButtonClick={onButtonClick}
          buttonDisabled={buttonDisabled}
        >
          {children}
        </ActStepPageContent>
      </div>
    </PageLayout>
  );
}

export default ActStepPage;
