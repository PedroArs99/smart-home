import React from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navbar from "./app/layout/Navbar";
import { BACKGROUND_COLOR } from "./app/config/theme";

export default function App() {
  return (
    <View id="app-root" style={styles.container}>
      <Navbar />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: BACKGROUND_COLOR,
  },
});
