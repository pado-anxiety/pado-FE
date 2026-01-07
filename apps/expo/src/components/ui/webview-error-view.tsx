import React from 'react';

import { Button } from '@pado/ui';
import { View } from 'react-native';

import { Text } from './text';

type WebViewErrorViewProps = {
  message?: string;
  onPressHome: () => void;
};

export function WebViewErrorView({
  message = '화면을 불러올 수 없습니다.',
  onPressHome,
}: WebViewErrorViewProps) {
  return (
    <View className="flex-1 bg-act-page justify-center items-center px-8 gap-8 absolute inset-0">
      <Text className="text-body-medium">{message}</Text>
      <Button
        text="홈으로 돌아가기"
        className="bg-btn-act-page"
        onPress={onPressHome}
      />
    </View>
  );
}
