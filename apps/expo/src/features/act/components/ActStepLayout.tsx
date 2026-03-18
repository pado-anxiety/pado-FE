import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, View } from '@src/components/ui';

import { STEP_LAYOUT_MARGIN_LEFT } from '../constants';

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
      <View className="flex-row items-center justify-between">
        <View style={{ marginLeft: STEP_LAYOUT_MARGIN_LEFT }}>
          {leftButton ?? <View className="h-11 w-11" />}
        </View>
        <View>{rightButton ?? <View className="h-11 w-11" />}</View>
      </View>

      <View className="mt-3 flex-1 gap-4">{children}</View>

      <View className="mt-6">
        <Button
          size="default"
          text={buttonText}
          onPress={onButtonClick}
          disabled={buttonDisabled}
          className="bg-btn-dark"
        />
      </View>
    </View>
  );
}
