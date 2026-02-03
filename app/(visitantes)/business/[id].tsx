import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function BusinessPublic() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0b1220" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={{ marginTop: 24, marginBottom: 12 }}>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
          Mercadinho São José
        </Text>
        <Text style={{ color: "#6c7f99", marginTop: 4 }}>ID: {id}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#19c37d",
            padding: 12,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#04110b", fontWeight: "800" }}>WhatsApp</Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "#2d78ff",
            padding: 12,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#071022", fontWeight: "800" }}>Ligar</Text>
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: "#111b2e",
          padding: 14,
          borderRadius: 14,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", marginBottom: 8 }}>
          Sobre o comércio
        </Text>
        <Text style={{ color: "#9fb3c8" }}>
          Descrição do comércio aqui (texto vindo do Firestore).
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#111b2e",
          padding: 14,
          borderRadius: 14,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", marginBottom: 8 }}>
          Endereço
        </Text>
        <Text style={{ color: "#9fb3c8" }}>Rua Principal, 133 • Centro</Text>
      </View>

      <Pressable
        style={{
          backgroundColor: "#ff8a3d",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#111", fontWeight: "800" }}>Abrir no mapa</Text>
      </Pressable>
    </ScrollView>
  );
}
