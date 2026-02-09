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
        <Text preset="heading" bold className="text-center text-neutral-900">
          {title}
        </Text>
        {subtitle && (
          <Text preset="body" className="text-center text-neutral-800">
            {subtitle}
          </Text>
        )}
      </View>
      <View className="mt-2">{children}</View>
    </View>
  );
}
