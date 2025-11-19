import { APP_COLOR } from "@/utils/constant";
import { Redirect } from "expo-router";
import { StyleSheet } from "react-native";

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

const WelcomePage = () => {
  if (true) {
    return <Redirect href={"/(auth)/signup" as any} />;
  }

};

export default WelcomePage;