import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome } from "@expo/vector-icons";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { firestore_db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  addToFriends,
  addToSentFriendRequests,
  removeFromFriendRequests,
  removeFromSentFriendRequests,
  selectStateUser,
} from "../features/slices/userSlice";

SplashScreen.preventAutoHideAsync();

const SearchProfile = () => {
  const [userUid, setUserUid] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const userSelector = useSelector(selectStateUser);
  const dispatch = useDispatch();

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

  const handleSearch = async () => {
    setLoading(true);
    setError(false);
    if (userUid.length > 0) {
      const usersRef = collection(firestore_db, "user");
      const q = query(usersRef, where("username", ">=", userUid), where("username", "<=", userUid + "\uf8ff"));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser({ uid: querySnapshot.docs[0].id, ...userData });
          setUserUid("");
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    }
    setLoading(false);
  };

  const handleFriends = () => {
    console.log("already friends");
  };

  const handleRequestSent = () => {
    console.log("request already sent");
  };

  const handleAcceptRequest = async () => {
    try {
      const userDocRef = doc(firestore_db, "user", userSelector.profile.uid);
      const userDocRefOther = doc(firestore_db, "user", user.uid);
      await updateDoc(userDocRefOther, {
        friends: arrayUnion(userSelector.profile.uid),
        sentFriendRequests: arrayRemove(userSelector.profile.uid),
      });
      await updateDoc(userDocRef, {
        friends: arrayUnion(user.uid),
        friendRequests: arrayRemove(user.uid),
      });
      dispatch(addToFriends(user.uid));
      dispatch(removeFromFriendRequests(user.uid));
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  };

  const handleSendRequest = async () => {
    console.log(user.id);
    try {
      const userDocRefOther = doc(firestore_db, "user", user.uid);
      const userDocRef = doc(firestore_db, "user", userSelector.profile.uid);
      await updateDoc(userDocRefOther, {
        friendRequests: arrayUnion(userSelector.profile.uid),
      });
      await updateDoc(userDocRef, {
        sentFriendRequests: arrayUnion(user.uid),
      });
      dispatch(addToSentFriendRequests(user.uid));
    } catch (error) {
      console.error("Error adding send request:", error);
      throw error;
    }
  };

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        backgroundColor: "black",
        height: "100%",
        flex: 1,
        padding: 8,
      }}
    >
      <View style={{ marginBottom: 10 }}>
        <Text style={{ color: "white", fontFamily: "HeroBd", fontSize: 35 }}>
          Search User
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <TextInput
          style={{
            backgroundColor: "#303030",
            fontSize: 17,
            padding: 7,
            borderRadius: 10,
            color: "white",
            fontFamily: "HeroRg",
            width: "90%",
          }}
          placeholder="Enter Username"
          placeholderTextColor={"#808080"}
          value={userUid}
          onChangeText={(text) => setUserUid(text)}
        />
        <TouchableOpacity onPress={handleSearch}>
          <FontAwesome name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 15 }}>
        {loading ? (
          <ActivityIndicator size={34} />
        ) : error ? (
          <View>
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "HeroBd",
                fontSize: 20,
              }}
            >
              No User Found
            </Text>
          </View>
        ) : user ? (
          <View
            style={{
              backgroundColor: "#202020",
              padding: 10,
              borderRadius: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{ color: "white", fontFamily: "HeroBd", fontSize: 20 }}
              >
                {user.displayName}
              </Text>
              <Text
                style={{ color: "white", fontFamily: "HeroBd", fontSize: 17 }}
              >
                {user.email}
              </Text>
            </View>
            <TouchableOpacity
              style={
                userSelector.friends.includes(user.uid)
                  ? styles.friends
                  : userSelector.sentFriendRequests.includes(user.uid)
                  ? styles.requestSent
                  : userSelector.friendRequests.includes(user.uid)
                  ? styles.acceptRequest
                  : styles.sendRequest
              }
              onPress={
                userSelector.friends.includes(user.uid)
                  ? handleFriends
                  : userSelector.sentFriendRequests.includes(user.uid)
                  ? handleRequestSent
                  : userSelector.friendRequests.includes(user.uid)
                  ? handleAcceptRequest
                  : handleSendRequest
              }
            >
              <Text
                style={{ color: "black", fontFamily: "HeroBd", fontSize: 15 }}
              >
                {userSelector.friends.includes(user.uid)
                  ? "Friends"
                  : userSelector.sentFriendRequests.includes(user.uid)
                  ? "Request Sent"
                  : userSelector.friendRequests.includes(user.uid)
                  ? "Accept request"
                  : "Send Request"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchProfile;

const styles = StyleSheet.create({
  friends: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 10,
  },
  requestSent: {
    backgroundColor: "yellow",
    padding: 5,
    borderRadius: 10,
  },
  acceptRequest: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,
  },
  sendRequest: {
    backgroundColor: "#d24dff",
    padding: 5,
    borderRadius: 10,
  },
});