import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const GroupsScreen = () => {
  // Temporary mock data
  const groups = [
    { id: "1", name: "Family Bingo Night" },
    { id: "2", name: "Friends Game Night" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Groups</Text>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text style={styles.groupName}>{item.name}</Text>
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
  groupItem: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 16,
  },
});

export default GroupsScreen;
