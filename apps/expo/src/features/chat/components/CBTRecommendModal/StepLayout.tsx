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
    <View className="mt-4 flex flex-col gap-4">
      <View className="flex flex-col gap-2">
        <Text className="text-center text-title-small font-medium leading-relaxed text-neutral-900">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-center text-body-large text-neutral-800">
            {subtitle}
          </Text>
        )}
      </View>
      <View className="mt-2">{children}</View>
    </View>
  );
}
