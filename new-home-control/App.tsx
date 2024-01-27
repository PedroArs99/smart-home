import React from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image } from "react-native";

const PlaceholderImage = require("./assets/images/background-image.png");

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    borderRadius: 18,
    width: 320,
    height: 440,
  },
  imageContainer: {
    flex: 1,
  },
});
