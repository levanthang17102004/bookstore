import authenticationAPI from "@/apis/authApi";
import ShareButton from "@/components/button/share.button";
import SocialButton from "@/components/button/social.button";
import ShareInput from "@/components/input/share.input";
import TextComponent from "@/components/TextComponent";
import { appColors } from "@/constants/appColors";
import { LoadingModal } from "@/modals";
import { APP_COLOR } from "@/utils/constant";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    gap: 10,
  },
});

const initValue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpPage = () => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if (
      !errorMessage ||
      (errorMessage &&
        (errorMessage.email ||
          errorMessage.password ||
          errorMessage.confirmPassword)) ||
      !values.email ||
      !values.password ||
      !values.confirmPassword
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [errorMessage, values]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = { ...values };

    data[`${key}`] = value;

    setValues(data);
  };

  const handleRegister = async () => {

    const { email, password, confirmPassword } = values

    if (email && password && confirmPassword) {

      setIsLoading(true);


      try {
        const res = await authenticationAPI.HandleAuthentication("/register", values, 'post');

        console.log("Response:", res);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    } else {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin')
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={{ fontSize: 25, fontWeight: "600", marginVertical: 30 }}>
            Đăng ký tài khoản
          </Text>

          <ShareInput
            title="Họ tên"
            value={values.username}
            setValue={(value) => handleChangeValue("username", value)}
          />
          <ShareInput
            title="Email"
            keyboardType="email-address"
            value={values.email}
            setValue={(value) => handleChangeValue("email", value)}
          />
          <ShareInput
            title="Mật khẩu"
            secureTextEntry={true}
            value={values.password}
            setValue={(value) => handleChangeValue("password", value)}
          />
          <ShareInput
            title="Xác nhận mật khẩu"
            secureTextEntry={true}
            value={values.confirmPassword}
            setValue={(value) => handleChangeValue("confirmPassword", value)}
          />
          <Text>
            {
              errorMessage && <TextComponent text={errorMessage} color={appColors.danger} />
            }
          </Text>

          <View style={{ marginVertical: 2 }}></View>
          <ShareButton
            title="Đăng Ký"
            onPress={handleRegister}
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
              marginVertical: 10,
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "black" }}>Đã có tài khoản?</Text>
            <Link href={"/(auth)/login"}>
              <Text
                style={{
                  color: APP_COLOR.ORANGE,
                  textDecorationLine: "underline",
                }}
              >
                Đăng nhập.
              </Text>
            </Link>
          </View>

          <SocialButton title="Đăng ký với" />
        </View>
      </SafeAreaView>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default SignUpPage;