import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

import type { ActResultData } from '../types';

interface ActResultContentProps extends ActResultData {
  onComplete: () => void;
  children?: React.ReactNode;
}

export function ActResultContent({
  title,
  description,
  buttonText,
  onComplete,
  children,
}: ActResultContentProps) {
  const insets = useSafeAreaInsets();

  const handleComplete = () => {
    triggerHaptic('NAVIGATE');
    onComplete();
  };

  return (
    <View
      className="flex-1 bg-act-page px-6 pt-6"
      style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <View className="gap-3">
            <Text
              preset="title"
              bold
            >
              {title}
            </Text>
            {description.map((line, index) => (
              <Text
                key={`result-${index}`}
                preset="body"
              >
                {line}
              </Text>
            ))}
          </View>
          {children}
        </View>
      </ScrollView>

      <Button
        text={buttonText}
        onPress={handleComplete}
        className="bg-btn-dark"
      />
    </View>
  );
}
