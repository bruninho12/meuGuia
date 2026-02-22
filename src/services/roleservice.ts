import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export async function isAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "admins", uid));
  return snap.exists();
}
