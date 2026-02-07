import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import type { Business, Category } from "../../src/types/models";
import Carrossel from "./business/carrossel";
import {
  fetchCategories,
  fetchFeaturedBusinesses,
} from "../../src/services/firestore";

export default function HomePublic() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Business[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [cats, feats] = await Promise.all([
          fetchCategories(),
          fetchFeaturedBusinesses(),
        ]);

        if (!isMounted) return;
        setCategories(cats);
        setFeatured(feats);
      } catch (e) {
        console.log("Erro ao buscar Home:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredFeatured = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return featured;
    return featured.filter((b) => (b.name || "").toLowerCase().includes(s));
  }, [featured, search]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Carrossel></Carrossel>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itajuípe - BA</Text>
        <Text style={styles.headerSubtitle}>Comércios locais em destaque</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar comércio ou serviço"
          placeholderTextColor="#6c7f99"
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Categorias</Text>

          <View style={styles.categoriesContainer}>
            {categories.map((c) => (
              <Pressable
                key={c.id}
                style={styles.categoryCard}
                onPress={() => {
                  console.log("Categoria:", c.name, c.id);
                }}
              >
                <Text style={styles.categoryText}>{c.name}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Comércios em destaque</Text>

          {filteredFeatured.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => router.push(`/(visitantes)/business/${b.id}`)}
              style={styles.businessCard}
            >
              <Text style={styles.businessName}>{b.name}</Text>
              <Text style={styles.businessAddress}>
                {(b.address || "").slice(0, 60)}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={() => router.push("/(comerciantes)/login")}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Acessar painel</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },
  content: {
    padding: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#9fb3c8",
    marginTop: 4,
  },
  searchBox: {
    backgroundColor: "#111b2e",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  searchInput: {
    color: "#fff",
  },
  loading: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#9fb3c8",
    marginTop: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  categoryCard: {
    backgroundColor: "#111b2e",
    padding: 12,
    borderRadius: 14,
    width: "48%",
  },
  categoryText: {
    color: "#fff",
    fontWeight: "600",
  },
  businessCard: {
    backgroundColor: "#111b2e",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  businessName: {
    color: "#fff",
    fontWeight: "800",
  },
  businessAddress: {
    color: "#9fb3c8",
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: "#ff8a3d",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  loginText: {
    color: "#111",
    fontWeight: "800",
  },
});
