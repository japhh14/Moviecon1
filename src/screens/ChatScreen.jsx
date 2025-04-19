import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectStateUser } from "../features/slices/userSlice";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firestore_db } from "../../firebase";

const ChatScreen = ({ navigation, route }) => {
  const receiver_id = route.params["receiver_id"];
  const receiver_name = route.params["receiver_name"];
  const userSelector = useSelector(selectStateUser);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const scrollViewRef = useRef();

  const handleSend = async () => {
    if (message.length !== 0 && userSelector.friends.includes(receiver_id)) {
      const timeStamp = serverTimestamp();
      const id = `${Date.now()}`;
      const _doc = {
        _id: id,
        timeStamp: timeStamp,
        receiver_id: receiver_id,
        sender_id: userSelector.profile.uid,
        data: message,
      };
      setMessage("");
      await addDoc(collection(firestore_db, "messages"), _doc)
        .then(() => {
          console.log("message sent successfully");
        })
        .catch((err) => {
          console.error("Error sending message:", err);
        });
    } else {
      console.warn("Cannot send message to non-friend or empty message");
    }
  };

  const getChats = () => {
    if (!userSelector.friends.includes(receiver_id)) {
      console.warn("Cannot fetch chats for non-friend");
      setChat([]);
      return () => {};
    }
    const msgQuery = query(
      collection(firestore_db, "messages"),
      orderBy("timeStamp", "asc"),
      where("sender_id", "in", [receiver_id, userSelector.profile.uid]),
      where("receiver_id", "in", [receiver_id, userSelector.profile.uid])
    );
    return onSnapshot(
      msgQuery,
      (querySnap) => {
        const upMsg = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched messages:", upMsg);
        setChat(upMsg);
      },
      (error) => {
        console.error("Error fetching chats:", error);
      }
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("FriendRequests")}>
          <FontAwesome name="bell" size={24} color="white" style={{ marginRight: 10 }} />
        </TouchableOpacity>
      ),
    });

    const unsubscribe = getChats();
    return () => unsubscribe();
  }, [receiver_id, userSelector.profile.uid, userSelector.friends]);

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        height: "100%",
        backgroundColor: "black",
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "#202020",
          padding: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          borderBottomColor: "grey",
          borderBottomWidth: 2,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="leftcircleo" size={32} color="#d24dff" />
        </TouchableOpacity>
        <Text style={{ color: "white", fontSize: 30 }}>{receiver_name}</Text>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1, gap: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          style={{
            backgroundColor: "#202020",
            padding: 5,
          }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {chat &&
            chat.map((item) => {
              if (item.sender_id === userSelector.profile.uid) {
                return (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: "#d24dff",
                      padding: 8,
                      alignSelf: "flex-end",
                      borderRadius: 10,
                      marginVertical: 2,
                      maxWidth: "60%",
                    }}
                  >
                    <Text style={{ fontSize: 17, color: "white" }}>
                      {item.data}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: "#404040",
                      padding: 8,
                      alignSelf: "flex-start",
                      borderRadius: 10,
                      marginVertical: 2,
                      maxWidth: "60%",
                    }}
                  >
                    <Text style={{ fontSize: 17, color: "white" }}>
                      {item.data}
                    </Text>
                  </View>
                );
              }
            })}
        </ScrollView>
        <View
          style={{
            backgroundColor: "#353535",
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 20,
          }}
        >
          <TextInput
            style={{
              backgroundColor: "#202020",
              color: "white",
              fontSize: 17,
              padding: 8,
              borderRadius: 15,
              width: "85%",
            }}
            placeholder="Type Here..."
            placeholderTextColor={"#808080"}
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{
              backgroundColor: "#202020",
              padding: 8,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome name="send" size={26} color="#d24dff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;