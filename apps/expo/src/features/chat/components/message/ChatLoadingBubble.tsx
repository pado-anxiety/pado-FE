import { ActivityIndicator } from 'react-native';

import { View } from '@src/components/ui';

export function ChatLoadingBubble() {
  return (
    <View className="items-center py-4">
      <ActivityIndicator
        size="small"
        color="rgba(255, 255, 255, 0.5)"
      />
    </View>
  );
}
