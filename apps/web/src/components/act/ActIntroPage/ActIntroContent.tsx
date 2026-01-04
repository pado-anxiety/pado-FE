'use client';

import ActIntroContentHeader from './ActIntroContentHeader';
import ActIntroSteps from './ActIntroSteps';
import ActIntroTip from './ActIntroTip';

interface ActIntroContentProps {
  contentTitle: string;
  contentDescription: string;
  steps: string[];
  tipText: string;
}

function ActIntroContent({
  contentTitle,
  contentDescription,
  steps,
  tipText,
}: ActIntroContentProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-4">
        <ActIntroContentHeader
          title={contentTitle}
          description={contentDescription}
        />
        <ActIntroSteps steps={steps} />
        <ActIntroTip tipText={tipText} />
      </div>
    </div>
  );
}

export default ActIntroContent;
