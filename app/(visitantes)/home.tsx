import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { getFeaturedBusinesses } from "../../src/services/businessService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { db } from "../../src/services/firebase";

console.log("Firebase conectado:", !!db);

export default function HomePublic() {
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    getFeaturedBusinesses().then(setBusinesses);
  }, []);

  const router = useRouter();

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
          placeholder="Buscar comércio ou serviço"
          placeholderTextColor="#6c7f99"
          style={{ color: "#fff" }}
        />
      </View>

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
        {["Restaurantes", "Moda", "Saúde", "Serviços"].map((c) => (
          <Pressable
            key={c}
            style={{
              backgroundColor: "#111b2e",
              padding: 12,
              borderRadius: 14,
              width: "48%",
            }}
            onPress={() => {}}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>{c}</Text>
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

      {businesses.map((b) => (
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
          <Text style={{ color: "#fff", fontWeight: "700" }}>{b.name}</Text>
          <Text style={{ color: "#9fb3c8", marginTop: 4 }}>{b.address}</Text>
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
        <Text style={{ color: "#111", fontWeight: "800" }}>Acessar painel</Text>
      </Pressable>
    </ScrollView>
  );
}
