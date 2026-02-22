import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(visitantes)" />
      <Stack.Screen name="(comerciantes)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}
