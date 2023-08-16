import React, { useCallback, useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { useFontAndSplash } from "./src/Hooks/FontsHook";
import MyStack from "./src/Navigation";
import { PaymentProvider } from "./src/Hooks/Payment";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function App() {
  const { fontsLoaded, onLayoutRootView } = useFontAndSplash();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar backgroundColor="black" translucent={true} />
      <PaymentProvider>
        <MyStack />
      </PaymentProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
