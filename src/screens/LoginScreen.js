import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const { width } = Dimensions.get("window");

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/bg.png")}
    >
      <View className="flex-1 justify-center items-center ">
        <Image
          source={require("../assets/images/woman.png")}
          style={{ width: width * 0.17, height: width * 0.17 }}
        />
        <Text className="text-xl text-white font-bold text-center">
          ArtiVerse
        </Text>
        <Pressable className="flex-row items-center w-40 bg-blue-600 p-2 mt-3 justify-center rounded-xl">
          <Ionicons name="logo-google" size={22} color="#ff5252" />
          <Text className="text-white font-bold ml-2 ">Sign-in</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
