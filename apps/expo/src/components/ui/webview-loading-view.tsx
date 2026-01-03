import { View } from 'react-native';

export function WebViewLoadingView({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View className="absolute inset-0 flex flex-1 justify-center items-center bg-act-page">
      {children}
    </View>
  );
}
