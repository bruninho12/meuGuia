import { View, Text, Pressable, ScrollView } from "react-native";

export default function Dashboard() {
  const actions = [
    "Editar informações do seu comércio",
    "Alterar logo",
    "Atualizar contatos",
    "Horário de funcionamento",
    "Gerenciar assinatura",
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0b1220" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "800",
          marginTop: 24,
        }}
      >
        Padaria São José
      </Text>

      <View
        style={{
          backgroundColor: "#111b2e",
          padding: 14,
          borderRadius: 14,
          marginTop: 12,
        }}
      >
        <Text style={{ color: "#9fb3c8" }}>Status</Text>
        <Text
          style={{
            color: "#19c37d",
            fontWeight: "900",
            fontSize: 16,
            marginTop: 4,
          }}
        >
          Ativo
        </Text>
        <Text style={{ color: "#9fb3c8", marginTop: 8 }}>
          Categoria: Padaria
        </Text>
      </View>

      <Text
        style={{
          color: "#fff",
          fontWeight: "800",
          fontSize: 16,
          marginTop: 18,
          marginBottom: 10,
        }}
      >
        Ações Principais
      </Text>

      {actions.map((a) => (
        <Pressable
          key={a}
          style={{
            backgroundColor: "#111b2e",
            padding: 14,
            borderRadius: 14,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>{a}</Text>
          <Text style={{ color: "#6c7f99", marginTop: 4 }}>
            Toque para abrir
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
