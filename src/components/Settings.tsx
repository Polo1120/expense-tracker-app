import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import type { RootTabNavigationProp } from "../types/navigation";

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
}

const SettingItem = ({ title, subtitle, icon, onPress }: SettingItemProps) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      {icon && (
        <Icon
          name={icon}
          type="feather"
          color="#8A8A8A"
          size={20}
          containerStyle={{ marginRight: 12 }}
        />
      )}
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Icon name="chevron-right" type="feather" color="#8A8A8A" size={20} />
  </TouchableOpacity>
);

export default function Settings() {
  const navigation = useNavigation<RootTabNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <SettingItem
          title="Dashboard & Budget"
          subtitle="Manage your budget and spending mode"
          icon="pie-chart"
          onPress={() => navigation.navigate("BudgetSettings")}
        />
      </View>

      {/* --- Section: Account --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          title="Profile"
          subtitle="View and edit your profile"
          icon="user"
          onPress={() => navigation.navigate("Profile")}
        />
        <SettingItem
          title="Security"
          subtitle="Change your password"
          icon="lock"
          onPress={() => navigation.navigate("Security")}
        />
      </View>

      {/* --- Section: App Settings --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <SettingItem title="Theme" subtitle="Light / Dark mode" icon="moon" />
        <SettingItem
          title="Notifications"
          subtitle="Manage alerts and reminders"
          icon="bell"
        />
      </View>

      {/* --- Section: Logout --- */}
      <View style={styles.section}>
        <SettingItem
          title="Logout"
          icon="log-out"
          onPress={() => console.log("Logout pressed")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#fff",
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#8A8A8A",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  itemSubtitle: {
    color: "#8A8A8A",
    fontSize: 13,
    marginTop: 2,
  },
});
