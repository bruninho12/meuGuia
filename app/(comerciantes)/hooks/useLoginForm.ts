import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { login, register } from "../../../src/services/authService";

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
      router.replace("/(comerciantes)/dashboard");
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
      await register(email.trim(), password);
      router.replace("/(comerciantes)/dashboard");
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
    if (!email) {
      return showAlert("Atenção", "Digite seu e-mail primeiro");
    }
    try {
      // Aqui você deve chamar a função de reset de senha
      // await resetPassword(email);
      showAlert(
        "Sucesso",
        "Um e-mail de recuperação foi enviado para " + email,
      );
    } catch (e: any) {
      showAlert("Erro", e?.message ?? "Não foi possível enviar o e-mail.");
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
