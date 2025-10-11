import { SafeAreaView } from "react-native-safe-area-context";
import AddExpense from "../components/AddExpense";

export default function AddExpenseScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AddExpense />
    </SafeAreaView>
  );
}
