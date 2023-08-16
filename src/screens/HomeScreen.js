import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
  Dimensions,
  Keyboard,
  ToastAndroid,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Ai } from "../API";
import * as FileSystem from "expo-file-system";
import { useFontAndSplash } from "../Hooks/FontsHook";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubscriptionModal from "../components/SubcriptionModal";
const { width } = Dimensions.get("window");
import { usePayment } from "../Hooks/Payment";

const HomeScreen = ({ navigation, route }) => {
  const { paymentId, setPaymentId } = usePayment();

  useEffect(() => {
    const getPayment = async () => {
      const storedPaymentId = await AsyncStorage.getItem("paymentId");
      if (storedPaymentId) {
        setPaymentId(storedPaymentId);
      }
    };
    getPayment();
  }, []);
  const checkSubscriptionStatus = async () => {
    try {
      if (paymentId === null) {
        setShowSubscriptionModal(true);
      } else {
        setShowSubscriptionModal(false);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };
  useEffect(() => {
    checkSubscriptionStatus();
  }, [paymentId]);
  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const savedItemsData = await AsyncStorage.getItem("savedItems");
        if (savedItemsData) {
          const parsedSavedItems = JSON.parse(savedItemsData);
          setSavedItems(parsedSavedItems);
        }
      } catch (error) {
        console.error("Error loading saved items:", error);
      }
    };

    loadSavedItems();
  }, []);

  const { fontsLoaded, onLayoutRootView } = useFontAndSplash();
  const [query, setQuery] = useState("");
  const [imageSources, setImageSources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (!fontsLoaded) {
    return null;
  }
  const HandlegetImages = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      const response = await axios.get(Ai(query));
      const images = response.data.images;
      const srcList = images.map((image) => image.src);
      setImageSources(srcList);
      Keyboard.dismiss();
    } catch (error) {
      console.log("Got Error ", error);
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  const HandleClear = () => {
    setImageSources([]);
    setQuery("");
  };
  const handleDownload = async () => {
    const filename = selectedImageUri.split("/").pop();
    const downloadUri = FileSystem.documentDirectory + filename + ".jpg";

    try {
      // Download the image to a temporary directory
      const downloadedImage = await FileSystem.downloadAsync(
        selectedImageUri,
        downloadUri
      );

      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(downloadedImage.uri);
        await MediaLibrary.createAlbumAsync("Downloaded", asset, false);
        Alert.alert("Download Successful", `Image saved to gallery.`);
      } else {
        Alert.alert(
          "Permission Denied",
          "Cannot save image to gallery without permission."
        );
      }
    } catch (error) {
      console.error("Error saving image to gallery:", error);
    }
  };

  const handleImageLongPress = (uri) => {
    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  const handleSaveItem = async () => {
    try {
      const isSaved = savedItems.includes(selectedImageUri);
      let newSavedItems;

      if (isSaved) {
        newSavedItems = savedItems.filter((item) => item !== selectedImageUri);
        ToastAndroid.show(
          "Image has been removed from your favorites.",
          ToastAndroid.SHORT
        );
      } else {
        newSavedItems = [...savedItems, selectedImageUri];
        ToastAndroid.show(
          "Image has been saved to your favorites.",
          ToastAndroid.SHORT
        );
      }

      setSavedItems(newSavedItems);
      await AsyncStorage.setItem("savedItems", JSON.stringify(newSavedItems));
    } catch (error) {
      console.error("Error saving/removing item:", error);
    }
  };
  const handleSubscriptionResponse = async (response) => {
    try {
      await AsyncStorage.setItem("subscriptionStatus", response);
      console.log(response);

      if (response === "seen") {
        setShowSubscriptionModal(false);
      } else {
        setShowSubscriptionModal(false);
        navigation.navigate("Subs");
      }
    } catch (error) {
      console.error("Error setting subscription status:", error);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/bg.png")}
    >
      <View
        className="top-12 rounded-xl px-2 z-40"
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Gpt3")}
          className="justify-center items-center w-35 p-2 rounded-xl px-4 "
        >
          <Text
            className="text-white text-lg "
            style={{
              color: route.name === "Gpt3" ? "black" : "white",
            }}
          >
            GPT-3
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="justify-center items-center w-35 p-2 rounded-xl ml-2 $"
        >
          <Text
            className="text-white text-lg "
            style={{
              color: route.name === "Home" ? "red" : "white",
            }}
          >
            GPT-3.5
          </Text>
        </TouchableOpacity>
      </View>
      <>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Search For AI Image"
            style={styles.input}
            value={query}
            onChangeText={(text) => setQuery(text)}
          />
          <TouchableOpacity
            disabled={query.length === 0}
            onPress={HandlegetImages}
          >
            <Ionicons
              name="search"
              color={query.length === 0 ? "gray" : "red"}
              size={25}
            />
          </TouchableOpacity>
        </View>

        {/* Display the fetched image source URLs in a FlatList */}
        <View className="top-60 -mt-20" onLayout={onLayoutRootView}>
          <View className="justify-between items-center flex-row px-2 -mt-10 ">
            {imageSources.length > 0 && (
              <>
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: "Lato-Re",
                    paddingLeft: 10,
                    color: "white",
                    marginBottom: 10,
                    fontWeight: "800",
                  }}
                >{`Showing Search Result : ${query}`}</Text>

                <Pressable onPress={HandleClear}>
                  <Text className="text-white text-md mb-2">Clear</Text>
                </Pressable>
              </>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <FlatList
              data={imageSources}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContainer}
              numColumns={2}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleImageLongPress(item)}>
                  <Image source={{ uri: item }} style={styles.image} />
                </Pressable>
              )}
            />
          )}

          {imageSources.length === 0 && query.length === 0 && (
            <View className="flex-col justify-center items-center ">
              <Image
                source={require("../assets/images/searching.png")}
                style={{
                  width: width * 0.48,
                  height: width * 0.5,
                }}
              />
            </View>
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.modalImage}
            />
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={handleDownload}>
                <Ionicons
                  name="cloud-download-outline"
                  size={24}
                  color="white"
                />
              </Pressable>
              <Pressable style={styles.button} onPress={handleSaveItem}>
                {savedItems.includes(selectedImageUri) ? (
                  <Ionicons name="heart" size={24} color="red" />
                ) : (
                  <Ionicons name="heart-outline" size={24} color="white" />
                )}
              </Pressable>

              <Pressable
                style={styles.button}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close-outline" size={24} color="white" />
              </Pressable>
            </View>
          </ScrollView>
        </Modal>
        <SubscriptionModal
          visible={showSubscriptionModal}
          onClose={() => handleSubscriptionResponse("seen")}
          onSubscribe={() => handleSubscriptionResponse("subscribed")}
        />
      </>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    width: "95%",
    height: 50,
    backgroundColor: "white",
    position: "absolute",
    top: 95,
    left: 5,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    zIndex: 40,
  },
  input: {
    width: "80%",
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
  flatListContainer: {
    gap: 5,
    paddingVertical: 10,
  },
  image: {
    width: width * 0.48,
    height: width * 0.5,
    margin: 5,
    resizeMode: "cover",
    borderRadius: 7,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {
    width: width * 0.6,
    height: width * 0.6,
    margin: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
