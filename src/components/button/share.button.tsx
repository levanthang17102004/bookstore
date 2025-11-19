import { ReactNode } from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
  
  const styles = StyleSheet.create({
    btnContainer: {
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      flexDirection: "row",
      gap: 10,
      alignItems: "center",
      backgroundColor: "#ccc",
      borderColor: "red",
    } as ViewStyle,
  });
  
  interface IProps {
    title: string;
    onPress: () => void;
    icons?: ReactNode;
    textStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    pressStyle?: StyleProp<ViewStyle>;
  }
  const ShareButton = (props: IProps) => {
    const { title, onPress, icons, textStyle, buttonStyle, pressStyle } = props;
  
    return (
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.5 : 1,
            alignSelf: "flex-start", // fit-content
          },
          pressStyle,
        ]}
        onPress={onPress}
      >
        <View style={[styles.btnContainer, buttonStyle]}>
          {icons}
          <Text style={textStyle}>{title}</Text>
        </View>
      </Pressable>
    );
  };
  
  export default ShareButton;