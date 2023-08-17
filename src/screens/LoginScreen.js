import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator } from "react-native";

const LoginScreen = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    configureAndCheckAuth();
    checkCurrentUser();
  }, []);
  const checkCurrentUser = async () => {
    const user = auth().currentUser;
    if (user) {
      navigation.replace("tabs");
    } else {
      setIsLoading(false);
    }
  };

  const configureAndCheckAuth = async () => {
    await GoogleSignin.configure({
      webClientId:
        "873240861094-93ihilpfhl9colm1mi39ciarala1pjh7.apps.googleusercontent.com",
      isLoggingEnabled: true,
    });
  };

  const onGoogleButtonPress = async () => {
    setIsLoading(true);
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth()
      .signInWithCredential(googleCredential)
      .then((user) => {
        console.log(user);
        navigation.replace("tabs");
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <ImageBackground
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        source={require("../assets/images/bg.png")}
      >
        <ActivityIndicator size={28} color="white" />
      </ImageBackground>
    );
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
        <Animated.Text style={styles.text}>Welcome to VirtuIntel</Animated.Text>
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
