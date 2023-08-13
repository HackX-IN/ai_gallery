import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");
const Favorites = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleImageLongPress = async (uri) => {
    if (!savedItems.includes(uri)) {
      const newSavedItems = savedItems.filter((item) => item !== uri);
      setSavedItems(newSavedItems);
      await AsyncStorage.setItem("savedItems", JSON.stringify(newSavedItems));
    }

    setSelectedImageUri(uri);
    setModalVisible(true);
  };

  const handleSaveItem = async () => {
    try {
      const isSaved = savedItems.includes(selectedImageUri);
      let newSavedItems;

      if (isSaved) {
        newSavedItems = savedItems.filter((item) => item !== selectedImageUri);
        Alert.alert(
          "Item Removed",
          "Image has been removed from your favorites."
        );
      } else {
        newSavedItems = [...savedItems, selectedImageUri];
        Alert.alert("Item Saved", "Image has been saved to your favorites.");
      }

      setSavedItems(newSavedItems);
      await AsyncStorage.setItem("savedItems", JSON.stringify(newSavedItems));

      // Remove the item from AsyncStorage if it's being un-saved
      if (!isSaved) {
        await AsyncStorage.removeItem(selectedImageUri);
        // Optionally, close the modal when the item is removed
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error saving/removing item:", error);
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const savedItemsData = await AsyncStorage.getItem("savedItems");
      if (savedItemsData) {
        const parsedSavedItems = JSON.parse(savedItemsData);

        // Filter out items that are no longer in the list
        const updatedSavedItems = parsedSavedItems.filter((item) =>
          savedItems.includes(item)
        );

        setSavedItems(updatedSavedItems);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setRefreshing(false);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/images/bg.png")}
    >
      <View className="mt-10">
        <FlatList
          data={savedItems}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => handleImageLongPress(item)}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Image source={{ uri: selectedImageUri }} style={styles.modalImage} />
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleDownload}>
              <Ionicons name="cloud-download-outline" size={24} color="white" />
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
    </ImageBackground>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    gap: 5,
  },
  image: {
    width: width * 0.48,
    height: width * 0.48,
    margin: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalImage: {
    width: 300,
    height: 300,
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
