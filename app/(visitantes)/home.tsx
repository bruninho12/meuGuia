import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import type { Business, Category } from "../../src/types/models";
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
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0b1220" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={{ marginTop: 24, marginBottom: 16 }}>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
          Itajuípe - BA
        </Text>
        <Text style={{ color: "#9fb3c8", marginTop: 4 }}>
          Comércios locais em destaque
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#111b2e",
          borderRadius: 14,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar comércio ou serviço"
          placeholderTextColor="#6c7f99"
          style={{ color: "#fff" }}
        />
      </View>

      {loading ? (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator />
          <Text style={{ color: "#9fb3c8", marginTop: 8 }}>
            Carregando dados...
          </Text>
        </View>
      ) : (
        <>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            Categorias
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            {categories.map((c) => (
              <Pressable
                key={c.id}
                style={{
                  backgroundColor: "#111b2e",
                  padding: 12,
                  borderRadius: 14,
                  width: "48%",
                }}
                onPress={() => {
                  // depois a gente cria a tela de listagem por categoria
                  console.log("Categoria:", c.name, c.id);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 10,
            }}
          >
            Comércios em destaque
          </Text>

          {filteredFeatured.map((b) => (
            <Pressable
              key={b.id}
              onPress={() => router.push(`/(visitantes)/business/${b.id}`)}
              style={{
                backgroundColor: "#111b2e",
                padding: 14,
                borderRadius: 14,
                marginBottom: 14,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>{b.name}</Text>
              <Text style={{ color: "#9fb3c8", marginTop: 4 }}>
                {(b.address || "").slice(0, 60)}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={() => router.push("/(comerciantes)/login")}
            style={{
              backgroundColor: "#ff8a3d",
              padding: 14,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111", fontWeight: "800" }}>
              Acessar painel
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
