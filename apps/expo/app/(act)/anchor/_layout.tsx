import { Stack } from 'expo-router';

export default function AnchorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step" />
      <Stack.Screen name="result" />
    </Stack>
  );
}
