import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";

const SubscriptionModal = ({ visible, onClose, onSubscribe }) => {
  const navigation = useNavigation();
  if (!visible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.subscriptionTitle}>Unlock Premium Features!</Text>
          <Text style={styles.subscriptionText}>
            Subscribe now to access exclusive features and content.
          </Text>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={onSubscribe}
          >
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.laterButton} onPress={onClose}>
            <Text style={styles.laterButtonText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subscriptionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  subscribeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  subscribeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  laterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  laterButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SubscriptionModal;
