import fbLogo from "@/assets/auth/facebook.png";
import ggLogo from "@/assets/auth/google.png";
import { APP_COLOR } from "@/utils/constant";
import { Image, StyleSheet, View } from "react-native";
import ShareButton from "./share.button";
import TextBetWeenLine from "./text.between.line";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  welcomeText: {
    flex: 0.6,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 20,
  },
  welcomeBtn: {
    flex: 0.4,
    gap: 30,
  },
  heading: {
    fontSize: 40,
    fontWeight: "600",
  },
  body: {
    fontSize: 30,
    color: APP_COLOR.ORANGE,
    marginVertical: 10,
  },
  footer: {},
});

interface IProps {
  title: string
}

const SocialButton = (props: IProps) => {
  const { title } = props;
  return (
    <View style={styles.welcomeBtn}>
      <TextBetWeenLine
        title={title}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <ShareButton
          title="faceBook"
          onPress={() => {
            alert("me");
          }}
          textStyle={{ textTransform: "uppercase" }}
          pressStyle={{ alignSelf: "stretch" }}
          buttonStyle={{
            justifyContent: "center",
            borderRadius: 30,
            backgroundColor: "#fff",
          }}
          icons={<Image source={fbLogo} />}
        />
        <ShareButton
          title="google"
          onPress={() => {
            alert("me");
          }}
          textStyle={{ textTransform: "uppercase" }}
          pressStyle={{ alignSelf: "stretch" }}
          buttonStyle={{
            justifyContent: "center",
            borderRadius: 30,
            paddingHorizontal: 20,
            backgroundColor: "#fff",
          }}
          icons={<Image source={ggLogo} />}
        />
      </View>
    </View>
  );
};

export default SocialButton;