import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { useFontAndSplash } from "../Hooks/FontsHook";

const ProfileScreen = () => {
  const { fontsLoaded, onLayoutRootView } = useFontAndSplash();
  const { width } = Dimensions.get("window");

  if (!fontsLoaded) {
    return null;
  }
  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/bg.png")}
    >
      <View
        className="flex-1 justify-center items-center  "
        onLayout={onLayoutRootView}
      >
        <Image
          source={{
            uri: "data:image/jpeg;base64,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",
          }}
          style={{
            width: width * 0.28,
            height: width * 0.28,
            borderRadius: 70,
            resizeMode: "cover",
            borderColor: "gold",
            borderWidth: 1,
          }}
        />
        <Text
          className="text-lg text-center text-white font-bold p-2"
          style={{ fontFamily: "Italic" }}
        >
          Ram Charan
        </Text>
        <TouchableOpacity className=" w-28 bg-red-600 items-center rounded-3xl">
          <Text
            className="text-lg text-center text-white font-bold p-2"
            style={{ fontFamily: "Italic" }}
          >
            Log-out
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
