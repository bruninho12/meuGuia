import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../src/services/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

interface Business {
  id: string;
  name: string;
  city: string;
  status: string;
  isFeatured: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    const snapshot = await getDocs(collection(db, "businesses"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));
    setBusinesses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const toggleFeatured = async (id: string, current: boolean) => {
    await updateDoc(doc(db, "businesses", id), {
      isFeatured: !current,
    });
    fetchBusinesses();
  };

  const toggleStatus = async (id: string, current: string) => {
    await updateDoc(doc(db, "businesses", id), {
      status: current === "active" ? "inactive" : "active",
    });
    fetchBusinesses();
  };

  const total = businesses.length;
  const active = businesses.filter((b) => b.status === "active").length;
  const featured = businesses.filter((b) => b.isFeatured).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Supremo</Text>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push("/(admin)/users")}
        >
          <Text style={styles.quickBtnText}>Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push("/(admin)/businesses")}
        >
          <Text style={styles.quickBtnText}>Comércios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickBtn}
          onPress={() => router.push("/(admin)/categories")}
        >
          <Text style={styles.quickBtnText}>Categorias</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <StatCard label="Total Comércios" value={total} />
        <StatCard label="Ativos" value={active} />
        <StatCard label="Destaques" value={featured} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff7b00" />
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.city}>{item.city}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.featureBtn}
                  onPress={() => toggleFeatured(item.id, item.isFeatured)}
                >
                  <Text style={styles.btnText}>
                    {item.isFeatured ? "Remover Destaque" : "Destacar"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statusBtn}
                  onPress={() => toggleStatus(item.id, item.status)}
                >
                  <Text style={styles.btnText}>
                    {item.status === "active" ? "Desativar" : "Ativar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function StatCard({ label, value }: any) {
  return (
    <LinearGradient colors={["#ff7b00", "#0f9b8e"]} style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1424",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: "#14233c",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  quickBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    padding: 15,
    borderRadius: 12,
    width: "30%",
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#14233c",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  city: {
    color: "#aaa",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureBtn: {
    backgroundColor: "#ff7b00",
    padding: 8,
    borderRadius: 8,
  },
  statusBtn: {
    backgroundColor: "#0f9b8e",
    padding: 8,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});
