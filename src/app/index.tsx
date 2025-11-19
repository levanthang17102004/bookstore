import { APP_COLOR } from "@/utils/constant";
import { useCurrentApp } from "@/context/app.context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  Easing 
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  splashImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: APP_COLOR.ORANGE,
    borderTopColor: "transparent",
  },
});

const WelcomePage = () => {
  const { appState } = useCurrentApp();
  const [showSplash, setShowSplash] = useState(true);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Bắt đầu animation xoay tròn
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1, // Lặp vô hạn
      false
    );
  }, []);

  useEffect(() => {
    // Hiển thị splash screen trong 2.5 giây
    const timer = setTimeout(() => {
      setShowSplash(false);
      
      // Sau khi ẩn splash, chờ thêm 0.5 giây rồi chuyển trang
      setTimeout(() => {
        if (appState?.user) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Animation style cho spinner xoay tròn
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Hiển thị splash screen với loading spinner
  if (showSplash) {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={require("@/assets/splash-1.png")}
          style={styles.splashImage}
        />
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.spinner, animatedStyle]} />
        </View>
      </SafeAreaView>
    );
  }

  // Component này sẽ không render vì đã redirect
  return null;
};

export default WelcomePage;