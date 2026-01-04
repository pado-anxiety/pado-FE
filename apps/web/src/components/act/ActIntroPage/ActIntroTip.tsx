'use client';

import { Text } from '@pado/ui';

interface ActIntroTipProps {
  tipText: string;
}

function ActIntroTip({ tipText }: ActIntroTipProps) {
  return (
    <div className="p-4 bg-white/50 rounded-xl border border-white">
      <Text className="text-body-small italic">{tipText}</Text>
    </div>
  );
}

export default ActIntroTip;
