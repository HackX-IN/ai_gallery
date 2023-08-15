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
import auth from "@react-native-firebase/auth";
import { Pressable } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
const ProfileScreen = ({ navigation }) => {
  const { fontsLoaded, onLayoutRootView } = useFontAndSplash();
  const { width } = Dimensions.get("window");
  const user = auth().currentUser; // Get the current user

  const signOut = async () => {
    try {
      await auth().signOut();
      console.log("User signed out!");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        <ImageBackground
          source={require("../assets/images/crown1.png")}
          style={{
            width: width * 0.5,
            height: width * 0.4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: user?.photoURL }} // Use the user's photo URL
            style={{
              width: width * 0.25,
              height: width * 0.26,
              borderRadius: 70,
              resizeMode: "cover",
              borderColor: "gold",
              borderWidth: 1,
              justifyContent: "center",
              marginTop: 18,
            }}
          />
        </ImageBackground>

        <Text
          className="text-lg text-center text-white font-bold p-2"
          style={{ fontFamily: "Italic" }}
        >
          {user?.displayName} {/* Display the user's name */}
        </Text>
        <Pressable className="p-2 w-30 flex-row justify-center items-center space-x-2 bg-yellow-400 rounded-2xl mb-3">
          <Text className="text-md text-black font-semibold">Buy Now</Text>
          <FontAwesome5 name="crown" size={20} color="white" />
        </Pressable>
        <TouchableOpacity
          className=" w-28 bg-red-600 items-center rounded-3xl"
          onPress={() => signOut()}
        >
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
