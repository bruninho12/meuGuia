import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Business, Category } from "../types/models";

export async function fetchCategories(): Promise<Category[]> {
  // Se você não tiver "order" em todas, pode remover o orderBy.
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Category, "id">),
  }));
}

export async function fetchFeaturedBusinesses(): Promise<Business[]> {
  const q = query(
    collection(db, "businesses"),
    where("status", "==", "active"),
    where("isFeatured", "==", true),
    limit(10),
  );
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Business, "id">),
  }));
}

export async function fetchBusinessById(id: string): Promise<Business | null> {
  const ref = doc(db, "businesses", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  return { id: snap.id, ...(snap.data() as Omit<Business, "id">) };
}
