import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="language" />
      <Stack.Screen name="vibration" />
      <Stack.Screen name="policy" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="license" />
    </Stack>
  );
}
