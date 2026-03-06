import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Divider, NavButton, Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';

import type { ActIntroData } from '../types';

interface ActIntroContentProps extends ActIntroData {
  onStart: () => void;
  onClose: () => void;
}

export function ActIntroContent({
  title,
  description,
  contentTitle,
  contentDescription,
  steps,
  tipText,
  buttonText,
  onStart,
  onClose,
}: ActIntroContentProps) {
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    triggerHaptic('NAVIGATE');
    onStart();
  };

  return (
    <View
      className="flex-1 bg-act-page px-6 pt-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 gap-6">
        {/* Header + Description */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text
              preset="title"
              bold
              className="flex-1"
            >
              {title}
            </Text>
            <NavButton
              variant="close"
              onPress={onClose}
            />
          </View>
          {description.map((line, index) => (
            <Text
              key={`desc-${index}`}
              preset="body"
            >
              {line}
            </Text>
          ))}
        </View>

        <Divider />

        {/* Content area */}
        <ScrollView
          className="mb-4 flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-6">
            {/* Content title & description */}
            <View className="gap-2">
              <Text
                preset="heading"
                bold
              >
                {contentTitle}
              </Text>
              <Text
                preset="sub"
                className="text-sub"
              >
                {contentDescription}
              </Text>
            </View>

            {/* Steps list */}
            <View className="gap-3">
              {steps.map((step, index) => (
                <Text
                  key={`step-${index}`}
                  preset="body"
                >
                  {step}
                </Text>
              ))}
            </View>

            {/* Tip box */}
            <View className="rounded-xl border border-white bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
              <Text
                preset="sub"
                style={{ fontStyle: 'italic' }}
              >
                {tipText}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Bottom button */}
      <Button
        text={buttonText}
        onPress={handleStart}
        className="bg-btn-act-page"
      />
    </View>
  );
}
