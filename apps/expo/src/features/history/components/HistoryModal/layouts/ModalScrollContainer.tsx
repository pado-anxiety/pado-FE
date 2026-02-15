import { ReactNode } from 'react';

import { StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';

interface ModalScrollContainerProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ModalScrollContainer({
  children,
  contentContainerStyle,
}: ModalScrollContainerProps) {
  return (
    <ScrollView
      bounces={false}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
      contentContainerStyle={[
        {
          display: 'flex',
          gap: scale(10),
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
