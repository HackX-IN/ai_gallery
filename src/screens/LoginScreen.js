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

    return unsubscribe;
  }, [navigation]);
  const { width } = Dimensions.get("window");
  const [isLoading, setIsLoading] = useState(false);

  GoogleSignin.configure({
    webClientId:
      "873240861094-93ihilpfhl9colm1mi39ciarala1pjh7.apps.googleusercontent.com",
    isLoggingEnabled: true,
  });

  const GoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      try {
        setIsLoading(true);
        const userCredential = await auth().signInWithCredential(
          googleCredential
        );

        if (userCredential && userCredential.user) {
          navigation.replace("tabs");
        } else {
          console.log("User sign-in failed.");
        }
      } catch (error) {
        console.error("Error signing in:", error);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

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
        <Pressable style={styles.button} onPress={GoogleLogin}>
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
