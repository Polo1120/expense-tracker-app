import { SafeAreaView } from "react-native-safe-area-context";
import BudgetSettings from "../components/BudgetSettings";

export default function BudgetSettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BudgetSettings />
    </SafeAreaView>
  );
}
