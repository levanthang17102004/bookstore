// file: RootLayout.tsx
import AppProvider from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { ErrorBoundaryProps, Stack } from "expo-router";
import { Button, Text, View } from "react-native";
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaView } from "react-native-safe-area-context";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 10, gap: 15 }}>
        <View style={{
          backgroundColor: "#333", padding: 10,
          borderRadius: 3, gap: 10
        }}>
          <Text style={{ color: "red", fontSize: 20 }}>
            Something went wrong
          </Text>
          <Text style={{ color: "#fff" }}>{error.message}</Text>
        </View>
        <Button title="Try Again ?" onPress={retry} />
      </View>
    </SafeAreaView>
  );
}

const RootLayout = () => {

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    }
  }

  return (
    <RootSiblingParent>
      <AppProvider>
        <ThemeProvider value={navTheme}>
          <Stack
            screenOptions={{
              headerTintColor: APP_COLOR.ORANGE,
              headerTitleStyle: {
                color: "black",
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/welcome"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/signup"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/verify"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/search"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/popup.sale"
              options={{ headerShown: false, animation: "fade", presentation: "transparentModal" }} />
            <Stack.Screen
              name="(auth)/restaurants"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)/forgot-password"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(user)/product/[id]"
              options={{ headerShown: false }} />
            <Stack.Screen
              name="(user)/product/create.modal"
              options={{
                headerShown: false,
                animation: "fade",
                presentation: "transparentModal",
              }} />
            <Stack.Screen
              name="(user)/product/update.modal"
              options={{
                headerShown: false,
                animation: "fade",
                presentation: "transparentModal",
              }} />
            <Stack.Screen
              name="(user)/product/place.order"
              options={{ headerTitle: "Xác nhận đơn hàng", headerBackTitle: 'Back' }} />
            <Stack.Screen
              name="(user)/account/info"
              options={{ headerTitle: "Cập nhật thông tin", headerBackTitle: 'Back' }} />
            <Stack.Screen
              name="(user)/account/change.password"
              options={{ headerTitle: "Đổi mật khẩu", headerBackTitle: 'Back' }} />
            <Stack.Screen
              name="(user)/account/change.language"
              options={{ headerTitle: "Ngôn ngữ", headerBackTitle: 'Back' }} />
            <Stack.Screen
              name="(user)/account/app.message"
              options={{ headerTitle: "Thông tin ứng dụng", headerBackTitle: "Back" }} />
          </Stack>
        </ThemeProvider>
      </AppProvider>
    </RootSiblingParent>
  )
};

export default RootLayout;