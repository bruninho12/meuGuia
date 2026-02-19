import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertState } from "../hooks/useLoginForm";

interface AlertProps {
  alert: AlertState;
}

export default function CustomAlert({ alert }: AlertProps) {
  if (!alert.visible) return null;

  return (
    <View style={styles.alertContainer}>
      <View style={styles.alertBox}>
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertMessage}>{alert.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  alertBox: {
    backgroundColor: "#0f1420",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,138,61,0.3)",
    maxWidth: "80%",
    shadowColor: "#ff8a3d",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  alertTitle: {
    color: "#ff8a3d",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  alertMessage: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
});
