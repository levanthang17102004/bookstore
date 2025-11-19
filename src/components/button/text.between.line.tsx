import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 14,
  },
});

interface IProps {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  lineStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const TextBetWeenLine = (props: IProps) => {
  const { title, textStyle, lineStyle, containerStyle } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.line, lineStyle]} />
      <Text style={[styles.text, textStyle]}>{title}</Text>
      <View style={[styles.line, lineStyle]} />
    </View>
  );
};

export default TextBetWeenLine;
