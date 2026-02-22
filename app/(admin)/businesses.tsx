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

type AdminBusiness = {
  id: string;
  name?: string;
  city?: string;
  status?: string;
  isFeatured?: boolean;
};

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBusinesses() {
    setLoading(true);
    const snap = await getDocs(collection(db, "businesses"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<AdminBusiness, "id">),
    }));
    setBusinesses(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Comércios</Text>
        <Pressable style={styles.refreshBtn} onPress={fetchBusinesses}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff7b00" />
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum comércio encontrado.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name || "Comércio sem nome"}</Text>
              <Text style={styles.info}>Cidade: {item.city || "-"}</Text>
              <Text style={styles.info}>Status: {item.status || "pending"}</Text>
              <Text style={styles.info}>
                Destaque: {item.isFeatured ? "Sim" : "Não"}
              </Text>
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
    backgroundColor: "#0f9b8e",
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
