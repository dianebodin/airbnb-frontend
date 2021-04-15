import React from 'react';
import { StyleSheet, View, ActivityIndicator } from "react-native";

const ActivityIndic = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#F1485C" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 150,
  }
});

export default ActivityIndic;