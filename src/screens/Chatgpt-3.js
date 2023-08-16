import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useFocusEffect } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import GlobalApi from "../utils/GetApi";

const Chatgpt3 = ({ navigation, route }) => {
  const [user, setUser] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const user = auth().currentUser;
    console.log(user);
    setUser(user);
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello ${user?.displayName}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Arti Verse",
          avatar: user?.photoURL,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    if (messages[0].text) {
      getBardResp(messages[0].text);
    }
    Keyboard.dismiss();
  }, []);

  const getBardResp = (msg) => {
    setLoading(true);
    GlobalApi.getBardApi(msg).then(
      (resp) => {
        if (resp.data.resp[1].content) {
          setLoading(false);
          const chatAIResp = {
            _id: Math.random() * (9999999 - 1),
            text: resp.data.resp[1].content,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "React Native",
              avatar: user?.photoURL,
            },
          };
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, chatAIResp)
          );
        } else {
          setLoading(false);
          const chatAIResp = {
            _id: Math.random() * (9999999 - 1),
            text: "Sorry, I can not help with it",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "React Native",
              avatar: user?.photoURL,
            },
          };
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, chatAIResp)
          );
        }
      },
      (error) => {}
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        style={{ flex: 1 }}
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
                color: route.name === "Gpt3" ? "red" : "white",
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
