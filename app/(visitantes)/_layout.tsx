import { Stack } from "expo-router";

export default function VisitantesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="business/[id]" />
    </Stack>
  );
}
