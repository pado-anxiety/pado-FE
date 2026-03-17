import { useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, NavButton, Text, View } from '@src/components/ui';
import { triggerHaptic } from '@src/lib/haptics';
import { useIconColor } from '@src/lib/theme/useIconColor';

import type { ActIntroData } from '../types';

interface ActIntroContentProps extends ActIntroData {
  onStart: () => void;
  onClose: () => void;
}

export function ActIntroContent({
  title,
  question,
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
  const [expanded, setExpanded] = useState(false);
  const rotation = useSharedValue(180);
  const { textSecondary } = useIconColor();

  const handleStart = () => {
    triggerHaptic('NAVIGATE');
    onStart();
  };

  const handleToggle = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    rotation.value = withTiming(newExpanded ? 0 : 180, { duration: 250 });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      className="flex-1 bg-act-page px-6 pt-4"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}
    >
      <View className="flex-1 gap-6">
        {/* Header + Question */}
        <Animated.View
          className="gap-3"
          layout={LinearTransition.duration(300)}
        >
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

          {/* Expandable question */}
          <Pressable
            onPress={handleToggle}
            className="flex-row flex-wrap items-center"
            hitSlop={{ top: 8, bottom: 8 }}
          >
            <Text preset="body">{question}</Text>
            <Animated.View style={[chevronStyle, { marginLeft: 6 }]}>
              <Feather
                name="chevron-down"
                size={18}
                color={textSecondary}
              />
            </Animated.View>
          </Pressable>

          {expanded &&
            description.map((line, index) => (
              <Animated.View
                key={`desc-${index}`}
                entering={FadeIn.duration(200).delay(index * 30)}
                exiting={FadeOut.duration(150)}
              >
                <Text preset="body">{line}</Text>
              </Animated.View>
            ))}
        </Animated.View>

        {/* Content area */}
        <Animated.View
          className="mb-4 flex-1"
          layout={LinearTransition.duration(300)}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-6 rounded-2xl border border-white bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
              {/* Content title & description */}
              <View className="gap-2">
                <Text preset="heading">{contentTitle}</Text>
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

              {/* Tip */}
              <Text
                preset="sub"
                style={{ fontStyle: 'italic' }}
              >
                {tipText}
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>

      {/* Bottom button */}
      <Button
        text={buttonText}
        onPress={handleStart}
        className="bg-btn-dark"
      />
    </View>
  );
}
