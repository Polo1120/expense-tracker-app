import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Icon } from "@rneui/themed";
import { useAuth } from "../hooks/useAuth";

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>No hay información disponible</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
     
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              user.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name || "Usuario"}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

    
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Icon name="badge" type="material" color="#66fcf1" size={24} />
          <Text style={styles.infoLabel}>ID:</Text>
          <Text style={styles.infoValue}>{user.id}</Text>
        </View>

        {user.created && (
          <View style={styles.infoRow}>
            <Icon name="event" type="material" color="#66fcf1" size={24} />
            <Text style={styles.infoLabel}>Miembro desde:</Text>
            <Text style={styles.infoValue}>
              {new Date(user.created).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0c10",
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#45a29e",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 16,
    color: "#c5c6c7",
    marginTop: 5,
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "#1f2833",
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoLabel: {
    color: "#66fcf1",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 5,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
  },
  noUserText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 100,
  },
});
