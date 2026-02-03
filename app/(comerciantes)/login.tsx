import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0b1220",
        padding: 16,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#fff",
          fontSize: 22,
          fontWeight: "800",
          marginBottom: 18,
        }}
      >
        Login do Comerciante
      </Text>

      <View
        style={{
          backgroundColor: "#111b2e",
          borderRadius: 14,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <TextInput
          placeholder="Email"
          placeholderTextColor="#6c7f99"
          style={{ color: "#fff" }}
        />
      </View>
      <View
        style={{
          backgroundColor: "#111b2e",
          borderRadius: 14,
          padding: 12,
          marginBottom: 14,
        }}
      >
        <TextInput
          placeholder="Senha"
          secureTextEntry
          placeholderTextColor="#6c7f99"
          style={{ color: "#fff" }}
        />
      </View>

      <Pressable
        onPress={() => router.replace("/(merchant)/dashboard")}
        style={{
          backgroundColor: "#ff8a3d",
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#111", fontWeight: "800" }}>Entrar</Text>
      </Pressable>
    </View>
  );
}
