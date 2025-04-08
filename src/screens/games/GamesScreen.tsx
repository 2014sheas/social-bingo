import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const GamesScreen = () => {
  // Temporary mock data
  const games = [
    { id: "1", name: "Friday Night Bingo", status: "active" },
    { id: "2", name: "Weekly Family Game", status: "upcoming" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Games</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gameItem}>
            <Text style={styles.gameName}>{item.name}</Text>
            <Text style={styles.gameStatus}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gameItem: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gameStatus: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default GamesScreen;
