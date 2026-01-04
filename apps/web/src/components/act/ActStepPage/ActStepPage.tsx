'use client';

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
}

function ActStepPage({
  leftButton,
  rightButton,
  children,
  buttonText,
  onButtonClick,
  buttonDisabled,
}: ActStepPageProps) {
  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-col w-full flex-1 justify-between ">
        <ActStepHeader
          leftButton={leftButton}
          rightButton={rightButton}
        />
        <div className="flex flex-col w-full flex-1 justify-between gap-4">
          <ActStepContent>{children}</ActStepContent>
          <ActStepButton
            text={buttonText}
            onClick={onButtonClick}
            disabled={buttonDisabled}
          />
        </div>
      </div>
    </PageLayout>
  );
}

export default ActStepPage;
