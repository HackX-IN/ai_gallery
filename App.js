import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import FontHook from "./src/Hooks/FontsHook";
import MyStack from "./src/Navigation";

export default function App() {
  const { fontsLoaded, onLayoutRootView } = FontHook();
  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <MyStack />
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
