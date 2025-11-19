import ShareButton from "@/components/button/share.button";
import ShareInput from "@/components/input/share.input";
import { resetPasswordAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Định dạng Email không hợp lệ!")
    .required("Email không được để trống!"),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      const res = await resetPasswordAPI(email);
      if (res.data) {
        Toast.show("Email đặt lại mật khẩu đã được gửi!", {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
        });
        router.back();
      } else {
        const m = Array.isArray(res.message) ? res.message[0] : res.message;
        Toast.show(m, {
          duration: Toast.durations.LONG,
          textColor: "white",
          backgroundColor: APP_COLOR.ORANGE,
          opacity: 1,
        });
      }
    } catch (error) {
      console.log("check error:", error);
      Toast.show("Gửi email thất bại. Vui lòng thử lại!", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        backgroundColor: "#f44336",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik
        validationSchema={ForgotPasswordSchema}
        initialValues={{ email: "" }}
        onSubmit={(values) => handleResetPassword(values.email)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.container}>
            <View>
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "600",
                  marginVertical: 30,
                }}
              >
                Quên mật khẩu
              </Text>
            </View>
            <ShareInput
              title="Email"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              error={errors.email}
            />
            <View style={{ marginVertical: 10 }}></View>
            <ShareButton
              Loading={loading}
              title="Gửi email đặt lại mật khẩu"
              onPress={handleSubmit as any}
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
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    gap: 10,
  },
});

export default ForgotPasswordPage;

