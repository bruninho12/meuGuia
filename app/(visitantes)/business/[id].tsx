import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchBusinessById } from "../../../src/services/firestore";
import type { Business } from "../../../src/types/models";

export default function BusinessPublic() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        if (!id) return;
        const data = await fetchBusinessById(String(id));
        if (!isMounted) return;
        setBusiness(data);
      } catch (e) {
        console.log("Erro ao buscar comércio:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const openWhatsApp = async () => {
    const phone = business?.whatsapp?.replace(/\D/g, "");
    if (!phone) return Alert.alert("WhatsApp não cadastrado");
    const url = `https://wa.me/55${phone}`;
    await Linking.openURL(url);
  };

  const callPhone = async () => {
    const phone = business?.phone?.replace(/\D/g, "");
    if (!phone) return Alert.alert("Telefone não cadastrado");
    await Linking.openURL(`tel:${phone}`);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0b1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
        <Text style={{ color: "#9fb3c8", marginTop: 8 }}>Carregando...</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0b1220",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>
          Comércio não encontrado
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0b1220" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={{ marginTop: 24, marginBottom: 12 }}>
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
          {business.name}
        </Text>
        {business.city ? (
          <Text style={{ color: "#6c7f99", marginTop: 4 }}>
            {business.city}
          </Text>
        ) : null}
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
        <Pressable
          onPress={openWhatsApp}
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
          onPress={callPhone}
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
          {business.about || "Sem descrição."}
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
        <Text style={{ color: "#9fb3c8" }}>
          {business.address || "Sem endereço."}
        </Text>
      </View>

      <Pressable
        onPress={() =>
          Alert.alert(
            "Mapa",
            "Depois a gente liga com lat/lng e abre no Google Maps.",
          )
        }
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
