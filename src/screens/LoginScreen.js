import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const LoginScreen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        navigation.replace("tabs");
      } else {
        navigation.replace("Login");
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe when component unmounts
  }, []); // Empty dependency array to ensure the effect runs only once

  const { width } = Dimensions.get("window");
  const [isLoading, setIsLoading] = useState(false);

  GoogleSignin.configure({
    webClientId:
      "873240861094-93ihilpfhl9colm1mi39ciarala1pjh7.apps.googleusercontent.com",
    isLoggingEnabled: true,
  });

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/bg.png")}
    >
      <View style={styles.contentContainer}>
        <Image
          source={require("../assets/images/woman.png")}
          style={{ width: width * 0.17, height: width * 0.17 }}
        />
        <Text style={styles.text}>ArtiVerse</Text>
        <Pressable style={styles.button} onPress={onGoogleButtonPress}>
          <Ionicons name="logo-google" size={22} color="#FFFC31" />
          <Text style={styles.buttonText}>Sign-in with Google</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: 200,
    backgroundColor: "#ff5252",
    padding: 10,
    marginTop: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default LoginScreen;
