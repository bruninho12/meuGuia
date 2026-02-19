import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";
import { register } from "../../src/services/authService";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLoginForm } from "./hooks/useLoginForm";
import CustomAlert from "./components/CustomAlert";
import CarrosselLogin from "./carrosselLogin";

export default function Signup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    email,
    setEmail,
    password,
    setPassword,
    showPass,
    setShowPass,
    loading,
    alert,
    emailOk,
    canSubmit,
    handleSignup,
  } = useLoginForm();

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#060a13" }}>
      <StatusBar barStyle="light-content" />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* CAROUSEL COM IMAGENS */}
          <CarrosselLogin />

          {/* LOGIN */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 18,
              paddingTop: 5,
              paddingBottom: Math.max(18, insets.bottom + 18),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <BlurView intensity={30} tint="dark" style={styles.loginCard}>
              <LinearGradient
                colors={["rgba(17,27,46,0.55)", "rgba(11,18,32,0.55)"]}
                style={{ padding: 16 }}
              >
                <Text style={styles.loginTitle}>Criar Uma Conta</Text>
                <Text style={styles.loginSub}>
                  Crie sua conta para acessar seu comércio.
                </Text>

                {/* Email */}
                <View style={{ marginTop: 18 }}>
                  <Text style={styles.label}>E-mail</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        borderColor:
                          email.length === 0
                            ? "rgba(255,255,255,0.10)"
                            : emailOk
                              ? "rgba(15,118,110,0.55)"
                              : "rgba(255,138,61,0.55)",
                      },
                    ]}
                  >
                    <Text style={styles.icon}>✦</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="seuemail@exemplo.com"
                      placeholderTextColor="rgba(159,179,200,0.65)"
                      style={styles.input}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoCorrect={false}
                    />
                  </View>
                  {emailTouched && !emailOk ? (
                    <Text style={styles.errorText}>
                      Digite um e-mail válido.
                    </Text>
                  ) : null}
                </View>

                {/* Password */}
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.label}>Senha</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        borderColor: passwordTouched
                          ? password.trim().length >= 6
                            ? "rgba(15,118,110,0.55)"
                            : "rgba(255,138,61,0.55)"
                          : "rgba(255,255,255,0.10)",
                      },
                    ]}
                  >
                    <Text style={styles.icon}>⟡</Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      onBlur={() => setPasswordTouched(true)}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(159,179,200,0.65)"
                      style={styles.input}
                      autoCapitalize="none"
                      secureTextEntry={!showPass}
                      onSubmitEditing={handleSignup}
                    />
                    <Pressable
                      onPress={() => setShowPass((v) => !v)}
                      hitSlop={10}
                      style={styles.showBtn}
                    >
                      <Text style={styles.showBtnText}>
                        {showPass ? "Ocultar" : "Mostrar"}
                      </Text>
                    </Pressable>
                  </View>
                  {passwordTouched && password.trim().length < 6 ? (
                    <Text style={styles.errorText}>
                      A senha deve ter pelo menos 6 caracteres.
                    </Text>
                  ) : null}
                </View>

                {/* Criar conta */}
                <Pressable
                  disabled={!canSubmit}
                  onPress={handleSignup}
                  style={[styles.ctaWrap, { opacity: canSubmit ? 1 : 0.55 }]}
                >
                  <LinearGradient
                    colors={["#ff8a3d", "#0f766e"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.cta}
                  >
                    {loading ? <ActivityIndicator /> : null}
                    <Text style={styles.ctaText}>Criar Conta</Text>
                  </LinearGradient>
                </Pressable>

                {/* Create account */}
                <View style={{ marginTop: 16, alignItems: "center" }}>
                  <Text style={styles.muted}>Já Tem uma conta?</Text>

                  <Pressable
                    onPress={() => router.push("/(comerciantes)/login")}
                    style={styles.secondaryBtn}
                  >
                    <Text style={styles.secondaryText}>Login</Text>
                  </Pressable>

                  <Text style={styles.terms}>
                    Ao continuar, você concorda com os termos e políticas.
                  </Text>
                </View>
              </LinearGradient>
            </BlurView>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <CustomAlert alert={alert} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tag: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.3,
  },

  loginCard: {
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#ff8a3d",
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  loginTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  loginSub: {
    color: "#9fb3c8",
    textAlign: "center",
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
  },

  label: {
    color: "#e2e8f0",
    fontWeight: "800",
    marginBottom: 10,
    fontSize: 14,
  },

  inputWrap: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    color: "#e2e8f0",
    fontWeight: "900",
    fontSize: 16,
  },

  input: {
    color: "#fff",
    flex: 1,
    fontSize: 15,
  },

  showBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "rgba(255,138,61,0.15)",
  },
  showBtnText: {
    color: "#ff8a3d",
    fontWeight: "800",
    fontSize: 12,
  },

  forgot: {
    color: "#ff8a3d",
    fontWeight: "900",
    fontSize: 13,
  },

  ctaWrap: {
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  cta: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  ctaText: {
    color: "#0a0f1a",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  muted: {
    color: "#9fb3c8",
    fontSize: 13,
  },
  secondaryBtn: {
    marginTop: 14,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    width: "100%",
    alignItems: "center",
  },
  secondaryText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },

  terms: {
    color: "rgba(148,163,184,0.7)",
    textAlign: "center",
    marginTop: 14,
    lineHeight: 20,
    fontSize: 12,
  },
  errorText: {
    color: "#ff8a3d",
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
  },
});
