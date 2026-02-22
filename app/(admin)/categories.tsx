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

type CategoryItem = {
  id: string;
  name?: string;
  order?: number;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    setLoading(true);
    const snap = await getDocs(collection(db, "categories"));
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<CategoryItem, "id">),
    }));

    data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Categorias</Text>
        <Pressable style={styles.refreshBtn} onPress={fetchCategories}>
          <Text style={styles.refreshText}>Atualizar</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff7b00" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhuma categoria encontrada.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name || "Sem nome"}</Text>
              <Text style={styles.info}>Ordem: {item.order ?? "-"}</Text>
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
