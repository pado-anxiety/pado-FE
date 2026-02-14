import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, View } from '@src/components/ui';

interface ActStepLayoutProps {
  leftButton?: React.ReactNode;
  rightButton?: React.ReactNode;
  children: React.ReactNode;
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
}

export function ActStepLayout({
  leftButton,
  rightButton,
  children,
  buttonText,
  onButtonClick,
  buttonDisabled = false,
}: ActStepLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-act-page px-6"
      style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View style={{ marginLeft: -6 }}>
          {leftButton ?? <View className="h-11 w-11" />}
        </View>
        <View>{rightButton ?? <View className="h-11 w-11" />}</View>
      </View>

      {/* Content — nav 터치 영역(44pt) 내부 여백이 시각적 간격 역할 */}
      <View className="mt-3 flex-1 gap-4">{children}</View>

      {/* Bottom button */}
      <View className="mt-6">
        <Button
          size="default"
          text={buttonText}
          onPress={onButtonClick}
          disabled={buttonDisabled}
          className="bg-btn-act-page"
        />
      </View>
    </View>
  );
}
