import { ActivityIndicator } from 'react-native';

export function LoadingSpinner({ color = 'black' }: { color?: string }) {
  return (
    <ActivityIndicator
      size="large"
      color={color}
    />
  );
}
