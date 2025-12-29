import { View } from '@src/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PageSafeAreaView({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={`flex flex-1 ${className}`}
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {children}
    </View>
  );
}
