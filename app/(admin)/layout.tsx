import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../src/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { View, ActivityIndicator } from "react-native";

async function isAdmin(uid: string) {
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists();
}

export default function AdminLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [adminOk, setAdminOk] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setAdminOk(false);
        setLoading(false);
        return;
      }

      const ok = await isAdmin(u.uid);
      setAdminOk(ok);
      setLoading(false);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/(comerciantes)/login");
      else if (!adminOk) router.replace("/(comerciantes)/login");
    }
  }, [loading, user, adminOk]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
