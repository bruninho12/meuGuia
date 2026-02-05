import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Dimensions,
  Animated,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { signIn } from "../../src/services/auth";

const { width: W, height: H } = Dimensions.get("window");
const SLIDE_W = W;
const DOT = 7;

type Slide = {
  title: string;
  subtitle: string;
  tag: string;
  accent: string; // laranja/teal etc
};

const SLIDES: Slide[] = [
  {
    title: "Painel do Comerciante",
    subtitle: "Controle sua vitrine na cidade em tempo real.",
    tag: "Realtime",
    accent: "#ff8a3d",
  },
  {
    title: "Destaques Premium",
    subtitle: "Apareça primeiro e aumente o fluxo no seu negócio.",
    tag: "Boost",
    accent: "#0f766e",
  },
  {
    title: "Ofertas & Promoções",
    subtitle: "Publique promoções e ganhe mais cliques no WhatsApp.",
    tag: "Campaigns",
    accent: "#7c3aed",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function FuturisticLogin() {
  const router = useRouter();

  // auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const canSubmit = emailOk && password.trim().length >= 6 && !loading;

  async function handleLogin() {
    try {
      if (!emailOk)
        return Alert.alert("Email inválido", "Digite um email válido.");
      if (password.trim().length < 6)
        return Alert.alert(
          "Senha inválida",
          "A senha deve ter pelo menos 6 caracteres.",
        );

      setLoading(true);
      await signIn(email.trim(), password);
      router.replace("/(merchant)/dashboard");
    } catch (e: any) {
      const msg =
        e?.code === "auth/invalid-credential"
          ? "Email ou senha incorretos."
          : (e?.message ?? "Não foi possível entrar.");
      Alert.alert("Erro ao entrar", msg);
    } finally {
      setLoading(false);
    }
  }

  // carousel animation
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1, backgroundColor: "#060a13" }}>
      <StatusBar barStyle="light-content" />

      {/* Fundo futurista */}
      <LinearGradient
        colors={["#060a13", "#0b1220", "#070b16"]}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* “Auroras” (bolas glow) */}
      <View
        style={{
          position: "absolute",
          top: -120,
          left: -120,
          width: 260,
          height: 260,
          borderRadius: 260,
          backgroundColor: "rgba(255,138,61,0.18)",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 80,
          right: -140,
          width: 320,
          height: 320,
          borderRadius: 320,
          backgroundColor: "rgba(15,118,110,0.18)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -140,
          left: -90,
          width: 340,
          height: 340,
          borderRadius: 340,
          backgroundColor: "rgba(124,58,237,0.16)",
        }}
      />

      {/* Grid “cyber” bem sutil */}
      <View
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
        }}
        pointerEvents="none"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <View
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: (H / 14) * i,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: (W / 10) * i,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
        ))}
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* TOP: Carousel */}
          <View style={{ height: H * 0.42 }}>
            <Animated.FlatList
              data={SLIDES}
              keyExtractor={(_, idx) => String(idx)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true },
              )}
              scrollEventThrottle={16}
              renderItem={({ item, index }) => {
                const inputRange = [
                  (index - 1) * SLIDE_W,
                  index * SLIDE_W,
                  (index + 1) * SLIDE_W,
                ];

                const translateY = scrollX.interpolate({
                  inputRange,
                  outputRange: [14, 0, 14],
                  extrapolate: "clamp",
                });

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.96, 1, 0.96],
                  extrapolate: "clamp",
                });

                const rotate = scrollX.interpolate({
                  inputRange,
                  outputRange: ["-2deg", "0deg", "2deg"],
                  extrapolate: "clamp",
                });

                return (
                  <View
                    style={{
                      width: SLIDE_W,
                      paddingHorizontal: 18,
                      paddingTop: 34,
                    }}
                  >
                    <Animated.View
                      style={{
                        transform: [{ translateY }, { scale }, { rotate }],
                        borderRadius: 28,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.08)",
                        shadowColor: item.accent,
                        shadowOpacity: 0.25,
                        shadowRadius: 24,
                        shadowOffset: { width: 0, height: 10 },
                        elevation: 6,
                      }}
                    >
                      <LinearGradient
                        colors={["rgba(17,27,46,0.92)", "rgba(11,18,32,0.92)"]}
                        style={{ padding: 18 }}
                      >
                        {/* top row */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              paddingVertical: 6,
                              paddingHorizontal: 10,
                              borderRadius: 999,
                              backgroundColor: "rgba(255,255,255,0.06)",
                              borderWidth: 1,
                              borderColor: "rgba(255,255,255,0.08)",
                            }}
                          >
                            <Text
                              style={{
                                color: "#cfe0f1",
                                fontWeight: "800",
                                fontSize: 12,
                              }}
                            >
                              {item.tag}
                            </Text>
                          </View>

                          <View style={{ flexDirection: "row", gap: 6 }}>
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: "rgba(255,255,255,0.16)",
                              }}
                            />
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: "rgba(255,255,255,0.10)",
                              }}
                            />
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: item.accent,
                                opacity: 0.75,
                              }}
                            />
                          </View>
                        </View>

                        {/* Title */}
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 28,
                            fontWeight: "900",
                            marginTop: 14,
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            color: "#9fb3c8",
                            marginTop: 8,
                            lineHeight: 18,
                          }}
                        >
                          {item.subtitle}
                        </Text>

                        {/* Accent bar */}
                        <View
                          style={{
                            marginTop: 16,
                            height: 10,
                            borderRadius: 999,
                            backgroundColor: "rgba(255,255,255,0.06)",
                            overflow: "hidden",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.06)",
                          }}
                        >
                          <View
                            style={{
                              width: "55%",
                              height: "100%",
                              borderRadius: 999,
                              backgroundColor: item.accent,
                              opacity: 0.85,
                            }}
                          />
                        </View>

                        {/* Mini “chips” */}
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            marginTop: 14,
                            flexWrap: "wrap",
                          }}
                        >
                          {["Busca", "Mapa", "WhatsApp", "Destaques"].map(
                            (t) => (
                              <View
                                key={t}
                                style={{
                                  paddingVertical: 8,
                                  paddingHorizontal: 12,
                                  borderRadius: 14,
                                  backgroundColor: "rgba(255,255,255,0.06)",
                                  borderWidth: 1,
                                  borderColor: "rgba(255,255,255,0.08)",
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#cfe0f1",
                                    fontWeight: "800",
                                    fontSize: 12,
                                  }}
                                >
                                  {t}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>
                      </LinearGradient>
                    </Animated.View>
                  </View>
                );
              }}
            />

            {/* Dots animados */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
                marginTop: 10,
              }}
            >
              {SLIDES.map((_, i) => {
                const inputRange = [
                  (i - 1) * SLIDE_W,
                  i * SLIDE_W,
                  (i + 1) * SLIDE_W,
                ];

                const scale = scrollX.interpolate({
                  inputRange,
                  outputRange: [1, 1.8, 1],
                  extrapolate: "clamp",
                });

                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.35, 1, 0.35],
                  extrapolate: "clamp",
                });

                const translateY = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, -2, 0],
                  extrapolate: "clamp",
                });

                return (
                  <Animated.View
                    key={`dot-${i}`}
                    style={{
                      width: DOT,
                      height: DOT,
                      borderRadius: DOT,
                      backgroundColor: "#ff8a3d",
                      opacity,
                      transform: [{ scale }, { translateY }],
                    }}
                  />
                );
              })}
            </View>
          </View>

          {/* BOTTOM: Login glass card */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: 18,
              paddingTop: 14,
              paddingBottom: 18,
            }}
          >
            <BlurView
              intensity={30}
              tint="dark"
              style={{
                borderRadius: 26,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <LinearGradient
                colors={["rgba(17,27,46,0.55)", "rgba(11,18,32,0.55)"]}
                style={{ padding: 16 }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 18, fontWeight: "900" }}
                >
                  Entrar
                </Text>
                <Text style={{ color: "#9fb3c8", marginTop: 6 }}>
                  Acesse sua conta para editar seu comércio.
                </Text>

                {/* Email */}
                <View style={{ marginTop: 14 }}>
                  <Text
                    style={{
                      color: "#cfe0f1",
                      fontWeight: "800",
                      marginBottom: 8,
                    }}
                  >
                    E-mail
                  </Text>
                  <View
                    style={{
                      borderRadius: 18,
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderWidth: 1,
                      borderColor:
                        email.length === 0
                          ? "rgba(255,255,255,0.10)"
                          : emailOk
                            ? "rgba(15,118,110,0.55)"
                            : "rgba(255,138,61,0.55)",
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text style={{ color: "#cfe0f1", fontWeight: "900" }}>
                      ✦
                    </Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="seuemail@exemplo.com"
                      placeholderTextColor="rgba(159,179,200,0.65)"
                      style={{ color: "#fff", flex: 1, fontSize: 15 }}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={{ marginTop: 12 }}>
                  <Text
                    style={{
                      color: "#cfe0f1",
                      fontWeight: "800",
                      marginBottom: 8,
                    }}
                  >
                    Senha
                  </Text>
                  <View
                    style={{
                      borderRadius: 18,
                      backgroundColor: "rgba(255,255,255,0.06)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.10)",
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Text style={{ color: "#cfe0f1", fontWeight: "900" }}>
                      ⟡
                    </Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(159,179,200,0.65)"
                      style={{ color: "#fff", flex: 1, fontSize: 15 }}
                      autoCapitalize="none"
                      secureTextEntry={!showPass}
                      onSubmitEditing={handleLogin}
                    />
                    <Pressable
                      onPress={() => setShowPass((v) => !v)}
                      hitSlop={10}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 14,
                        backgroundColor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "900" }}>
                        {showPass ? "Ocultar" : "Mostrar"}
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Forgot */}
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      "Em breve",
                      "Vamos ligar recuperação de senha com Firebase.",
                    )
                  }
                  hitSlop={10}
                  style={{ alignSelf: "center", marginTop: 12 }}
                >
                  <Text style={{ color: "#ff8a3d", fontWeight: "900" }}>
                    Esqueceu sua senha?
                  </Text>
                </Pressable>

                {/* Continue */}
                <Pressable
                  disabled={!canSubmit}
                  onPress={handleLogin}
                  style={{
                    marginTop: 14,
                    borderRadius: 20,
                    overflow: "hidden",
                    opacity: canSubmit ? 1 : 0.55,
                  }}
                >
                  <LinearGradient
                    colors={["#ff8a3d", "#0f766e"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingVertical: 14,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    {loading ? <ActivityIndicator /> : null}
                    <Text
                      style={{
                        color: "#071022",
                        fontWeight: "900",
                        fontSize: 16,
                      }}
                    >
                      Continue
                    </Text>
                  </LinearGradient>
                </Pressable>

                {/* Bottom actions */}
                <View style={{ marginTop: 12, alignItems: "center" }}>
                  <Text style={{ color: "#9fb3c8" }}>Ainda não tem conta?</Text>
                  <Pressable
                    onPress={() => router.push("/(merchant)/signup")}
                    style={{
                      marginTop: 10,
                      borderRadius: 18,
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.10)",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "900" }}>
                      Criar uma conta
                    </Text>
                  </Pressable>

                  {/* Social UI */}
                  <View style={{ width: "100%", gap: 10, marginTop: 10 }}>
                    <Pressable
                      onPress={() =>
                        Alert.alert(
                          "Em breve",
                          "Apple/Google a gente integra depois.",
                        )
                      }
                      style={{
                        borderRadius: 18,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.10)",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "900" }}>
                        
                      </Text>
                      <Text style={{ color: "#fff", fontWeight: "900" }}>
                        Apple
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        Alert.alert(
                          "Em breve",
                          "Apple/Google a gente integra depois.",
                        )
                      }
                      style={{
                        borderRadius: 18,
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        backgroundColor: "rgba(255,255,255,0.06)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.10)",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "900" }}>
                        ◎
                      </Text>
                      <Text style={{ color: "#fff", fontWeight: "900" }}>
                        Google
                      </Text>
                    </Pressable>
                  </View>

                  <Text
                    style={{
                      color: "rgba(159,179,200,0.75)",
                      textAlign: "center",
                      marginTop: 12,
                      lineHeight: 18,
                    }}
                  >
                    Ao continuar, você concorda com os termos e políticas.
                  </Text>
                </View>
              </LinearGradient>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}
