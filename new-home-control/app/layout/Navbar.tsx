import { StyleSheet, View, Text } from "react-native";
import { PADDING_3, PRIMARY_COLOR, TEXT_COLOR, TEXT_XL } from "../config/theme";

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: "100%",

    backgroundColor: PRIMARY_COLOR,
  },
  title: {
    color: TEXT_COLOR,

    fontSize: TEXT_XL,
    fontWeight: 'bold',

    padding: PADDING_3,
  },
});

export default function Navbar() {
  return (
    <View id="app-navbar" style={styles.container}>
      <Text style={styles.title}>Home Control</Text>
    </View>
  );
}
