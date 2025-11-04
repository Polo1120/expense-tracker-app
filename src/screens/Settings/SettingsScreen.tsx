import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Text, Icon, useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { SettingsStackNavigationProp } from "../../types/navigation";
import { useAuth } from "../../hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingItemProps {
  title: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

const SettingItem = ({ title, onPress, rightComponent }: SettingItemProps) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        item: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 12,
          marginBottom: 10,
        },
        itemTitle: {
          textAlign: "left",
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          fontSize: 16,
          fontWeight: "100",
        },
      }),
    [theme]
  );

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {rightComponent ? (
        rightComponent
      ) : (
        <Icon
          name="chevron-right"
          type="feather"
          color={theme.colors.grey3}
          size={20}
        />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen({
  toggleTheme,
}: {
  toggleTheme: () => void;
}) {
  const { theme } = useTheme();
  const navigation = useNavigation<SettingsStackNavigationProp>();
  const { logout } = useAuth();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: 16,
        },
        section: {
          marginBottom: 24,
        },
        sectionTitle: {
          color:
            theme.mode === "dark" ? theme.colors.white : theme.colors.black,
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
          textAlign: "left",
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard & Budget</Text>
          <SettingItem
            title="Dashboard & Budget"
            onPress={() => navigation.navigate("BudgetSettings")}
          />
        </View>

        {/* --- Section: Account --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            title="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
          <SettingItem
            title="Security"
            onPress={() => navigation.navigate("Security")}
          />
        </View>

        {/* --- Section: App Settings --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <SettingItem
            title="Dark Mode"
            rightComponent={
              <Switch
                value={theme.mode === "dark"}
                onValueChange={toggleTheme}
              />
            }
          />
          <SettingItem
            title="Currency"
            onPress={() => navigation.navigate("Currency")}
          />
          <SettingItem title="Notifications" />
        </View>

        {/* --- Section: Logout --- */}
        <View style={styles.section}>
          <SettingItem title="Logout" onPress={logout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
