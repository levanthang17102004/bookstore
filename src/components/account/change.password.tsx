import ShareInput from "@/components/input/share.input";
import { useCurrentApp } from "@/context/app.context";
import { changePasswordAPI } from "@/utils/api"; // Assume this function is defined  
import { APP_COLOR } from "@/utils/constant";
import { ChangePasswordSchema } from "@/utils/validate.schema"; // Assume this schema is defined  
import { Formik } from "formik";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingTop: 50
    }
});

const ChangePassword = () => {
    const { appState } = useCurrentApp();

    const handleChangePassword = async (currentPassword: string, newPassword: string) => {
        const res = await changePasswordAPI(currentPassword, newPassword);
        if (res.data) {
            Toast.show("Đổi mật khẩu thành công!", {
                duration: Toast.durations.LONG,
                textColor: "white",
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1
            });
        } else {
            const message = Array.isArray(res.message) ? res.message[0] : res.message;
            Toast.show(message, {
                duration: Toast.durations.LONG,
                textColor: 'white',
                backgroundColor: APP_COLOR.ORANGE,
                opacity: 1
            });
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Formik
                        validationSchema={ChangePasswordSchema}
                        initialValues={{ currentPassword: '', newPassword: '' }}
                        onSubmit={values => handleChangePassword(values.currentPassword, values.newPassword)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
                            <View style={{ gap: 20 }}>
                                <ShareInput
                                    title="Mật khẩu hiện tại"
                                    onChangeText={handleChange('currentPassword')}
                                    onBlur={handleBlur('currentPassword')}
                                    secureTextEntry
                                    value={values.currentPassword}
                                    error={errors.currentPassword}
                                    touched={touched.currentPassword}
                                />
                                <ShareInput
                                    title="Mật khẩu mới"
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    secureTextEntry
                                    value={values.newPassword}
                                    error={errors.newPassword}
                                    touched={touched.newPassword}
                                />
                                <Pressable
                                    disabled={!(isValid && dirty)}
                                    onPress={handleSubmit as any}
                                    style={({ pressed }) => ({
                                        opacity: pressed === true ? 0.5 : 1,
                                        backgroundColor: isValid && dirty ? APP_COLOR.ORANGE : APP_COLOR.GREY,
                                        padding: 10,
                                        marginTop: 10,
                                        borderRadius: 3
                                    })}
                                >
                                    <Text style={{
                                        textAlign: "center",
                                        color: isValid && dirty ? "white" : "grey"
                                    }}>Lưu thay đổi</Text>
                                </Pressable>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ChangePassword;