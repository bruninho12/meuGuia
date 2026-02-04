import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "./firebase";

export async function getFeaturedBusinesses() {
  const q = query(
    collection(db, "businesses"),
    where("status", "==", "active"),
    where("isFeatured", "==", true),
    limit(10),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
