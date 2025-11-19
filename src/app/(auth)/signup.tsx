import authenticationAPI from "@/apis/authApi";
import ShareButton from "@/components/button/share.button";
import SocialButton from "@/components/button/social.button";
import ShareInput from "@/components/input/share.input";
import TextComponent from "@/components/TextComponent";
import { appColors } from "@/constants/appColors";
import { LoadingModal } from "@/modals";
import { APP_COLOR } from "@/utils/constant";
import { Validate } from "@/utils/validate";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
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
  const router = useRouter();
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>({});
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    const validation = Validate.validateSignUp(values);
    const hasErrors = Object.keys(validation.errors).length > 0;
    setIsDisable(hasErrors);
    setErrorMessage(validation.errors);
  }, [values]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = { ...values };
    data[`${key}`] = value;
    setValues(data);
  };

  const handleRegister = async () => {
    const validation = Validate.validateSignUp(values);

    if (!validation.isValid) {
      setErrorMessage(validation.errors);
      Toast.show("Vui lòng kiểm tra lại thông tin", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage({});

    try {
      const res = await authenticationAPI.HandleAuthentication(
        "/register",
        {
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        },
        "post"
      );

      console.log("Response:", res);
      Toast.show("Đăng ký thành công!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: "#4CAF50",
      });
      
      // Navigate to login or verify page after successful registration
      setTimeout(() => {
        router.push("/(auth)/login");
      }, 1500);
    } catch (error: any) {
      console.error("Error:", error);
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        "Đăng ký thất bại. Vui lòng thử lại!";
      
      Toast.show(errorMsg, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: "#f44336",
      });
      
      if (error?.data?.errors) {
        setErrorMessage(error.data.errors);
      }
    } finally {
      setIsLoading(false);
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
          {errorMessage.username && (
            <TextComponent
              text={errorMessage.username}
              color={appColors.danger}
              size={12}
            />
          )}

          <ShareInput
            title="Email"
            keyboardType="email-address"
            value={values.email}
            setValue={(value) => handleChangeValue("email", value)}
          />
          {errorMessage.email && (
            <TextComponent
              text={errorMessage.email}
              color={appColors.danger}
              size={12}
            />
          )}

          <ShareInput
            title="Mật khẩu"
            secureTextEntry={true}
            value={values.password}
            setValue={(value) => handleChangeValue("password", value)}
          />
          {errorMessage.password && (
            <TextComponent
              text={errorMessage.password}
              color={appColors.danger}
              size={12}
            />
          )}

          <ShareInput
            title="Xác nhận mật khẩu"
            secureTextEntry={true}
            value={values.confirmPassword}
            setValue={(value) => handleChangeValue("confirmPassword", value)}
          />
          {errorMessage.confirmPassword && (
            <TextComponent
              text={errorMessage.confirmPassword}
              color={appColors.danger}
              size={12}
            />
          )}

          <View style={{ marginVertical: 2 }}></View>
          <ShareButton
            title="Đăng Ký"
            onPress={handleRegister}
            disabled={isDisable || isLoading}
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
              backgroundColor: isDisable || isLoading ? APP_COLOR.GREY : APP_COLOR.ORANGE,
              opacity: isDisable || isLoading ? 0.6 : 1,
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