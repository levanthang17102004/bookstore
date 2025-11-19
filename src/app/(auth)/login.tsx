import authenticationAPI from "@/apis/authApi";
import ShareButton from "@/components/button/share.button";
import SocialButton from "@/components/button/social.button";
import ShareInput from "@/components/input/share.input";
import { APP_COLOR } from "@/utils/constant";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    gap: 10,
  },
  inputGroup: {
    padding: 5,
    gap: 10,
  },
  text: {
    fontSize: 18,
  },
  input: {
    borderColor: "#d0d0d0",
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const res = await authenticationAPI.HandleAuthentication('/hello');
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "600",
              marginVertical: 30,
            }}
          >
            Đăng nhập tài khoản
          </Text>
        </View>
        <ShareInput
          title="Email"
          keyboardType="email-address"
          value={email}
          setValue={setEmail}
        />
        <ShareInput
          title="Password"
          secureTextEntry={true}
          value={password}
          setValue={setPassword}
        />
        <View style={{ marginVertical: 10 }}></View>
        <ShareButton
          title="Đăng Nhập"
          onPress={handleLogin}
          textStyle={{
            color: "#fff",
            paddingVertical: 5,
            textTransform: "uppercase",
          }}
          buttonStyle={{
            justifyContent: "center",
            borderRadius: 30,
            marginHorizontal: 50,
            paddingVertical: 10,
            backgroundColor: APP_COLOR.ORANGE,
          }}
          pressStyle={{ alignSelf: "stretch" }}
        />

        <View
          style={{
            marginVertical: 15,
            flexDirection: "row",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "black" }}>Chưa có tài khoản?</Text>
          <Link href={"/(auth)/signup"}>
            <Text
              style={{
                color: APP_COLOR.ORANGE,
                textDecorationLine: "underline",
              }}
            >
              Đăng ký.
            </Text>
          </Link>
        </View>



        <SocialButton
          title="Đăng nhập với"
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;