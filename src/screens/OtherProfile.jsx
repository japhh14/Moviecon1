import { View, Text, SafeAreaView, StatusBar, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectStateUser } from "../features/slices/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { firestore_db } from "../../firebase";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Debug import checks
console.log("Import check - useSelector:", typeof useSelector);
console.log("Import check - selectStateUser:", typeof selectStateUser);

SplashScreen.preventAutoHideAsync();

const OtherProfile = ({ route, navigation }) => {
  const { username } = route.params || {};
  const userSelector = useSelector(selectStateUser);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    HeroLg: require("../assets/fonts/Hero-Light.ttf"),
    HeroRg: require("../assets/fonts/Hero-Regular.ttf"),
    HeroBd: require("../assets/fonts/Hero-Bold.ttf"),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (!username) {
          console.warn("No username provided in route params");
          return;
        }
        const userDocRef = doc(firestore_db, "user", username);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user found with username:", username);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [username, fontsLoaded]);

  if (!fontsLoaded || loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="#d24dff" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "black",
        padding: 15,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {userData?.photoUrl ? (
          <Image
            source={{ uri: userData.photoUrl }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
              borderColor: "#d24dff",
            }}
          />
        ) : (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#d24dff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "HeroBd",
                fontSize: 40,
                color: "white",
              }}
            >
              {userData?.displayName?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}
      </View>
      <Text style={{ color: "white", fontSize: 24, fontFamily: "HeroBd" }}>
        {userData?.displayName || "Unknown User"}
      </Text>
      <Text style={{ color: "white", fontFamily: "HeroRg" }}>
        Username: @{userData?.username || userData?.displayName || "N/A"}
      </Text>
      <Text style={{ color: "white", fontFamily: "HeroRg" }}>
        Email: {userData?.email || "N/A"}
      </Text>
    </SafeAreaView>
  );
};

export default OtherProfile;