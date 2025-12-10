import { Stack } from 'expo-router';

export default function PagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="button" />
      <Stack.Screen name="form" />
      <Stack.Screen name="lang" />
      <Stack.Screen name="text" />
      <Stack.Screen name="modal" />
    </Stack>
  );
}
