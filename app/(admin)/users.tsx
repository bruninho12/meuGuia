import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/services/firebase";

type UserItem = {
  id: string;
  email?: string;
  name?: string;
  role?: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    const snap = await getDocs(collection(db, "users"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<UserItem, "id">),
    }));
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Usuários</Text>
        <Pressable style={styles.refreshBtn} onPress={fetchUsers}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff7b00" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum usuário encontrado.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name || "Usuário sem nome"}</Text>
              <Text style={styles.info}>{item.email || "Sem e-mail"}</Text>
              <Text style={styles.info}>Papel: {item.role || "user"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1424",
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  refreshBtn: {
    backgroundColor: "#ff7b00",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  refreshText: {
    color: "#fff",
    fontWeight: "700",
  },
  empty: {
    color: "#9fb3c8",
    marginTop: 18,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#14233c",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  name: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  info: {
    color: "#9fb3c8",
    marginTop: 6,
  },
});
