// file: RootLayout.tsx
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          name="(tabs)"
          options={{ headerShown: false }} />
        <Stack.Screen
          name="product/index"
          options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  )
};

export default RootLayout;