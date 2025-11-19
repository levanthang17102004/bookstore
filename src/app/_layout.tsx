// file: RootLayout.tsx
import AppProvider from "@/context/app.context";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent'
    }
  }

  return (
    <RootSiblingParent>
      <AppProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ThemeProvider value={navTheme}>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#f4511e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen
                name="index"
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
                name="(auth)/forgot-password"
                options={{ headerShown: false }} />
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }} />
              <Stack.Screen
                name="product/index"
                options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </SafeAreaView>
      </AppProvider>
    </RootSiblingParent>
  )
};

export default RootLayout;