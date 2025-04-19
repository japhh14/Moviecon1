import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { useSelector } from "react-redux";
import { selectStateUser } from "../features/slices/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";

SplashScreen.preventAutoHideAsync();

const MainChat = ({ navigation }) => {
  const userSelector = useSelector(selectStateUser);
  const [friendlist, setFriendlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUser = async (id) => {
    const docRef = doc(firestore_db, "user", id);
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        return docSnapshot.data();
      }
    } catch (error) {
      console.error("Error fetching document data:", error);
    }
  };

  const getFriends = async () => {
    setLoading(true);
    const friendsArray = [...userSelector.friends];
    const friendListData = await Promise.all(
      friendsArray.map(async (id) => {
        const userData = await getUser(id);
        return { id, ...userData };
      })
    );

    setFriendlist(friendListData);
    setLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, [userSelector.friends]);

  const [fontsLoaded] = useFonts({
    HeroLg: require("../assets/fonts/Hero-Light.ttf"),
    HeroRg: require("../assets/fonts/Hero-Regular.ttf"),
    HeroBd: require("../assets/fonts/Hero-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        backgroundColor: "black",
        height: "100%",
        padding: 8,
      }}
    >
      <View
        style={{
          borderBottomColor: "#505050",
          borderBottomWidth: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "white",
            fontFamily: "HeroBd",
            fontSize: 35,
            padding: 5,
          }}
        >
          CHAT
        </Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileSearchNavigator")}
          >
            <Ionicons name="person-add" size={28} color="#d24dff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("FriendRequests")}
          >
            <FontAwesome name="bell" size={28} color="#d24dff" />
            {userSelector.friendRequests.length !== 0 ? (
              <Text
                style={{
                  color: "red",
                  position: "absolute",
                  right: -5,
                  top: -8,
                  fontFamily: "HeroBd",
                  fontSize: 20,
                  backgroundColor: "white",
                  paddingHorizontal: 5,
                  borderRadius: 100,
                }}
              >
                {userSelector.friendRequests.length}
              </Text>
            ) : (
              <></>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator size={24} />
      ) : friendlist.length > 0 ? (
        <ScrollView style={{ padding: 10 }}>
          {friendlist.map((item, id) => (
            <TouchableOpacity
              key={id}
              onPress={() =>
                navigation.navigate("ChatScreen", {
                  receiver_id: item.uid,
                  receiver_name: item.displayName,
                })
              }
              style={{ marginVertical: 10 }}
            >
              <View
                style={{
                  backgroundColor: "#202020",
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: 15,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: "HeroBd",
                    }}
                  >
                    {item.displayName}
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "HeroRg",
                      fontSize: 17,
                    }}
                  >
                    {item.email}
                  </Text>
                </View>
                <AntDesign name="caretright" size={40} color="#d24dff" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text
          style={{
            color: "white",
            fontFamily: "HeroBd",
            fontSize: 25,
            textAlign: "center",
            margin: 20,
          }}
        >
          No Friends
        </Text>
      )}
    </SafeAreaView>
  );
};

export default MainChat;
