import { Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


export const NetworkBanner = () => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.banner}>
      <MaterialIcons name="wifi-off" size={24} color="#fff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Sin conexión a Internet</Text>
        <Text style={styles.subtitle}>Revisa tu red o inténtalo de nuevo más tarde.</Text>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#FF6B6B",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    alignItems: "flex-start",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
  },
});
