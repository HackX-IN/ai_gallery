import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import Chatbot from "../assets/images/chatbot.png";
import GlobalApi from "../utils/GetApi";

const Chatgpt3 = ({ navigation, route }) => {
  const [user, setUser] = useState(null); // Initialize user as null
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const currentUser = auth().currentUser;
    console.log(currentUser);
    setUser(currentUser);
  };

  useEffect(() => {
    // Update the initial greeting message if user information is available
    let greeting;
    if (user && user.displayName) {
      greeting = `Hello ${user.displayName}!`;
    } else {
      greeting = "Hello Champ!";
    }

    // Add the initial greeting message
    setMessages([
      {
        _id: 1,
        text: greeting,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Arti Verse",
          avatar: Chatbot,
        },
      },
    ]);
  }, [user]);

  const onSend = useCallback(
    async (newMessages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      if (newMessages.length > 0 && newMessages[0].text) {
        getBardResp(newMessages[0].text);
      }

      // Save the updated messages to AsyncStorage
      try {
        const messagesJSON = JSON.stringify(messages);
        await AsyncStorage.setItem("chatMessages", messagesJSON);
      } catch (error) {
        console.error("Error saving messages to AsyncStorage:", error);
      }

      Keyboard.dismiss();
    },
    [messages]
  );

  const getBardResp = (msg) => {
    setLoading(true);
    GlobalApi.getBardApi(msg).then(
      (resp) => {
        setLoading(false);
        const chatAIResp = {
          _id: Math.random() * 9999999, // You can generate a random ID in a more reliable way
          text: resp.data.resp[1].content || "Sorry, I cannot help with it",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: Chatbot,
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, chatAIResp)
        );
      },
      (error) => {
        setLoading(false);
        console.error("Error fetching response:", error);
      }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require("../assets/images/bg.png")}
      >
        <View
          className="top-9 pt-1 px-2 z-10 "
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            paddingVertical: 5,
            marginBottom: 32,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="justify-center items-center w-35 p-2 rounded-xl px-4  flex-row"
          >
            <Fontisto
              name="star"
              size={16}
              color={route.name === "Home" ? "red" : "white"}
            />
            <Text
              className="text-white text-lg ml-1 "
              style={{
                color: route.name === "Home" ? "red" : "white",
              }}
            >
              GPT-3.5
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Gpt3")}
            className="justify-center items-center w-35 p-2 rounded-xl ml-2 flex-row"
          >
            <MaterialCommunityIcons
              name="solar-power"
              size={24}
              color={route.name === "Gpt3" ? "red" : "white"}
            />
            <Text
              className="text-white text-lg ml-1"
              style={{
                color: route.name === "Gpt3" ? "red" : "white",
              }}
            >
              GPT-3
            </Text>
          </TouchableOpacity>
        </View>

        <GiftedChat
          messages={messages}
          isTyping={loading}
          multiline={true}
          onSend={onSend}
          user={{
            _id: 1,
          }}
        />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default Chatgpt3;
