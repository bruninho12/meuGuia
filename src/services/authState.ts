// para saber se está logado
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
