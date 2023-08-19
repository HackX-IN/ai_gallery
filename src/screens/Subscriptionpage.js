import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { usePayment } from "../Hooks/Payment";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SubscriptionPage = () => {
  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/bg.png")}
    >
      <Text style={styles.title}>Unlock Premium Features</Text>
      <View style={styles.cardContainer}>
        <FeatureCard
          title="Ad-Free Experience"
          description="Enjoy the app without any annoying ads,Access to exclusive content and features,Get priority customer support for any issues"
          icon={require("../assets/images/diamond.png")}
          price={99}
        />
      </View>
    </ImageBackground>
  );
};

const FeatureCard = ({ title, description, icon, price }) => {
  useEffect(() => {
    const getpayment = async () => {
      await AsyncStorage.getItem("paymentId").then((storedPaymentId) => {
        if (storedPaymentId) {
          setPaymentId(storedPaymentId);
        }
      });
    };
    getpayment();
  }, []);
  const navigation = useNavigation();
  const { paymentId, setPaymentId } = usePayment();
  const handlePayment = (price) => {
    var options = {
      description: "Turns Imaginary to Reality",
      image: "https://i.imgur.com/3g7nmJC.jpg",
      currency: "INR",
      key: Your_Razorpay_key,
      amount: price * 100, // Convert price to paise (1 INR = 100 paise)
      name: "ArtiVerse",
      order_id: "", // Replace this with an order_id created using Orders API.
      prefill: {
        email: "XX+XXX@example.com",
        contact: "9191919191",
        name: "XXX-XXX",
      },
      theme: { color: "#53a20e" },
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        // handle success

        // Store the payment ID in AsyncStorage
        await AsyncStorage.setItem("paymentId", data.razorpay_payment_id);
        setPaymentId(data.razorpay_payment_id);
        navigation.goBack();
      })
      .catch((error) => {
        // handle failure
        ToastAndroid.show(
          "Transaction Failed, Please try again.",
          ToastAndroid.SHORT
        );
      });
  };
  return (
    <View style={styles.featureCard}>
      <Image source={icon} style={styles.featureIcon} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
      {paymentId ? (
        <TouchableOpacity className=" bg-red-500  px-4 py-2 items-center flex-row rounded-2xl justify-center mt-2">
          <Text style={styles.price1}>Already Purchased</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className=" bg-red-500  px-4 py-2 items-center flex-row rounded-2xl justify-center mt-2"
          onPress={handlePayment(price)}
        >
          <Text style={styles.price}>₹ {price}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  featureCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  featureIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  featureDescription: {
    textAlign: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",

    color: "#fff", // Customize the color
  },
  price1: {
    fontSize: 16,
    fontWeight: "bold",

    color: "#000", // Customize the color
  },
});

export default SubscriptionPage;
