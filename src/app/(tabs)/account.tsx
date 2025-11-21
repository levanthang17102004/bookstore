import fbLogo from "@/assets/auth/facebook.png";
import ggLogo from "@/assets/auth/google.png";
import bg from "@/assets/auth/welcome-background.png";
import ShareButton from "@/components/button/share.button";
import TextBetWeenLine from "@/components/button/text.between.line";
import { APP_COLOR } from "@/utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

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

    return (
        <ImageBackground style={{ flex: 1 }} source={bg}>
            <LinearGradient
                style={{
                    flex: 1,
                }}
                colors={["transparent", "#191B2F"]}
                locations={[0.2, 0.8]}
            >
                <View style={styles.container}>
                    <View style={styles.welcomeText}>
                        <Text style={styles.heading}>Welcome To</Text>
                        <Text style={styles.body}>App - Food</Text>
                        <Text style={styles.footer}>
                            Nền tảng đặt đồ ăn nhanh và tiện lợi
                        </Text>
                    </View>
                    <View style={styles.welcomeBtn}>
                        <TextBetWeenLine title="Đăng nhập với" />
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
                                    router.push("https://www.facebook.com/login");
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
                                    router.push("https://accounts.google.com/signin");
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
                        <View>
                            <ShareButton
                                title="Đăng nhập với email"
                                onPress={() => {
                                    router.navigate("/(auth)/login")
                                }}
                                textStyle={{ color: "#fff", paddingVertical: 5 }}
                                buttonStyle={{
                                    justifyContent: "center",
                                    borderRadius: 30,
                                    marginHorizontal: 50,
                                    paddingVertical: 10,
                                    backgroundColor: "#2c2c2c",
                                    borderColor: "#505050",
                                    borderWidth: 1,
                                }}
                                pressStyle={{ alignSelf: "stretch" }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                gap: 10,
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ color: "white" }}>Chưa có tài khoản?</Text>
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
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

export default WelcomePage;