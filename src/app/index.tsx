
import { useCurrentApp } from "@/context/app.context";
import { getAccountAPI } from "@/utils/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const RootPage = () => {
  const { setAppState } = useCurrentApp()
  const [state, setState] = useState<any>();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        const res = await getAccountAPI();
        console.log(">>check res", res)
        if (res.data) {
          //success
          const token = await AsyncStorage.getItem("accesstoken");
          setAppState({
            user: res.data as IUserLogin['user'],
            accesstoken: token ?? undefined

          })
          router.replace("/(tabs)")
          // await AsyncStorage.removeItem("accesstoken")
        } else {
          //error
          router.replace("/(auth)/welcome" as any)
        }
      } catch (e) {
        setState(() => {
          throw new Error("Không thể kết nối với API backend...")

        })
        // console.log("Không thể kết nối với API backend...")
        // console.warn(e);
      } finally {
        // Tell the application to render
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // if (true) {
  //   return <Redirect href={"/(tabs)"} />;
  // }

  return (
    <>

    </>
  );
};

export default RootPage;