import { ReactNode } from 'react';

import { Text, View } from '@src/components/ui';

interface StepLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function StepLayout({
  title,
  subtitle,
  children,
}: StepLayoutProps) {
  return (
    <View className="flex flex-col gap-4 mt-4">
      <View className="flex flex-col gap-2">
        <Text className="text-title-small text-neutral-900 text-center font-medium leading-relaxed">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-body-large text-neutral-800 text-center">
            {subtitle}
          </Text>
        )}
      </View>
      <View className="mt-2">{children}</View>
    </View>
  );
}
