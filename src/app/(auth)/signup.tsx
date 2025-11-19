import authenticationAPI from "@/apis/authApi";
import ShareButton from "@/components/button/share.button";
import SocialButton from "@/components/button/social.button";
import ShareInput from "@/components/input/share.input";
import { LoadingModal } from "@/modals";
import { APP_COLOR } from "@/utils/constant";
import { SignUpSchema } from "@/utils/validate.schema";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
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

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: SignUpFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values: SignUpFormValues) => {
    setIsLoading(true);

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
        error?.message ||
        error?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại!";
      
      Toast.show(errorMsg, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: "#f44336",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={SignUpSchema}
          onSubmit={handleRegister}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <View style={styles.container}>
              <Text style={{ fontSize: 25, fontWeight: "600", marginVertical: 30 }}>
                Đăng ký tài khoản
              </Text>

              <ShareInput
                title="Họ tên"
                value={values.username}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                error={touched.username && errors.username ? errors.username : undefined}
              />

              <ShareInput
                title="Email"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email && errors.email ? errors.email : undefined}
              />

              <ShareInput
                title="Mật khẩu"
                secureTextEntry={true}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password ? errors.password : undefined}
              />

              <ShareInput
                title="Xác nhận mật khẩu"
                secureTextEntry={true}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
              />

              <View style={{ marginVertical: 2 }}></View>
              <ShareButton
                title="Đăng Ký"
                onPress={() => handleSubmit()}
                disabled={!isValid || isLoading}
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
                  backgroundColor: !isValid || isLoading ? APP_COLOR.GREY : APP_COLOR.ORANGE,
                  opacity: !isValid || isLoading ? 0.6 : 1,
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
          )}
        </Formik>
      </SafeAreaView>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default SignUpPage;