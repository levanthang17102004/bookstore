import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface IProps {
  title: string;
}

const TextBetWeenLine = ({ title }: IProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  line: {
    width: "20%",
    height: 1,
    backgroundColor: "#ccc",
  },
  text: {
    color: "black",
    fontSize: 16,
  },
});

export default TextBetWeenLine;