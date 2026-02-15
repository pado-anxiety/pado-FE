import { ReactNode } from 'react';

import { View } from '@src/components/ui';

interface ContentBoxProps {
  children: ReactNode;
}

export function ContentBox({ children }: ContentBoxProps) {
  return (
    <View className="gap-1 rounded-xl border border-white bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
      {children}
    </View>
  );
}
