import { SafeAreaView } from "react-native-safe-area-context";
import Dashboard from "../components/Dashboard";
export default function DashboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Dashboard />
    </SafeAreaView>
  );
}
