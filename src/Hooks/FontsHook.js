import { useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

export function useFontAndSplash() {
  const [fontsLoaded] = useFonts({
    "Lato-Re": require("../assets/fonts/Lato-Regular.ttf"),
    SEA: require("../assets/fonts/SEASRN__.ttf"),
    Italic: require("../assets/fonts/LeagueGothic-Italic.otf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // Additional functionality you want to perform when layout changes
      // For example, you can log a message or execute some other code.
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return { fontsLoaded, onLayoutRootView };
}
