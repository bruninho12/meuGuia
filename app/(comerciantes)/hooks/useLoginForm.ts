import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import {
  login,
  register,
  resetPassword,
} from "../../../src/services/authService";
import { isAdmin } from "../../../src/services/roleservice";
import { auth } from "../../../src/services/firebase";

export interface AlertState {
  title: string;
  message: string;
  visible: boolean;
}

export function useLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    title: "",
    message: "",
    visible: false,
  });

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
  const canSubmit = emailOk && password.trim().length >= 6 && !loading;

  const showAlert = (title: string, message: string) => {
    setAlert({ title, message, visible: true });
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 4000);
  };

  async function routeAfterAuth() {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      router.replace("/(comerciantes)/dashboard");
      return;
    }

    const admin = await isAdmin(uid);

    if (admin) router.replace("/(admin)/dashboard");
    else router.replace("/(comerciantes)/dashboard");
  }

  const handleLogin = async () => {
    if (!emailOk) return showAlert("Email inválido", "Digite um email válido.");
    if (password.trim().length < 6)
      return showAlert(
        "Senha inválida",
        "A senha deve ter pelo menos 6 caracteres.",
      );

    try {
      setLoading(true);

      await login(email.trim(), password);

      await routeAfterAuth();
    } catch (e: any) {
      showAlert(
        "Erro ao entrar",
        e?.code === "auth/invalid-credential"
          ? "Email ou senha incorretos."
          : (e?.message ?? "Não foi possível entrar."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!emailOk) return showAlert("Email inválido", "Digite um email válido.");
    if (password.trim().length < 6)
      return showAlert(
        "Senha inválida",
        "A senha deve ter pelo menos 6 caracteres.",
      );

    try {
      setLoading(true);

      await register(email.trim(), password);

      await routeAfterAuth();
    } catch (e: any) {
      showAlert(
        "Erro ao criar conta",
        e?.code === "auth/email-already-in-use"
          ? "Email já está em uso ou inválido."
          : (e?.message ?? "Não foi possível criar a conta."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!emailOk)
      return showAlert("Atenção", "Digite um e-mail válido primeiro.");

    try {
      setLoading(true);

      await resetPassword(email.trim());

      showAlert(
        "Sucesso",
        "Um e-mail de recuperação foi enviado para " + email.trim(),
      );
    } catch (e: any) {
      showAlert("Erro", e?.message ?? "Não foi possível enviar o e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
    showAlert,
    handleLogin,
    handleReset,
    handleSignup,
  };
}
