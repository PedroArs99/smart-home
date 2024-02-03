import { StyleSheet, View, Image } from "react-native";
import { PRIMARY_COLOR } from "../config/colors";

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: '100%',

    backgroundColor: PRIMARY_COLOR,
  },
});

export default function Navbar() {
  return <View style={styles.container}></View>;
}
