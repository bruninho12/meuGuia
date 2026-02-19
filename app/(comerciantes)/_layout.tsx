import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeAuth } from "../../src/services/authState";
import { View, ActivityIndicator } from "react-native";

export default function ComercianteLayout() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(comerciantes)/login");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
