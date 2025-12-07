import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="button" />
      <Stack.Screen name="form" />
    </Stack>
  );
}
