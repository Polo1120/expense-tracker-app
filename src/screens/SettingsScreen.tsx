import { SafeAreaView } from "react-native-safe-area-context";
import Settings from "../components/Settings";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Settings />
    </SafeAreaView>
  );
}
