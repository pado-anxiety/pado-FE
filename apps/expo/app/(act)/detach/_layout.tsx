import { Stack } from 'expo-router';

export default function DetachLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
