import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import MovieCard from "../components/MovieCard";
import { getAuth } from "firebase/auth";
import { app, firestore_db } from "../../firebase";
import { useDispatch } from "react-redux";
import {
  loadProfile,
  updateFavorites,
  updateFriendRequests,
  updateFriends,
  updateSentFriendRequests,
  updateWatchlist,
} from "../features/slices/userSlice";
import { doc, getDoc } from "firebase/firestore";

SplashScreen.preventAutoHideAsync();

const Home = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const scroll = React.createRef();
  const dispatch = useDispatch();

  const getData = async (page) => {
    try {
      const url = `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=fc6b0f8734f6d710fed11de93fc496cc`;
      const response = await fetch(url);
      const moviedata = await response.json();
      setData(moviedata);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const updateProfile = async () => {
    const user = getAuth(app).currentUser;
    dispatch(
      loadProfile({
        email: user.email,
        photoUrl: user.photoURL,
        uid: user.uid,
        displayName: user.displayName,
      })
    );
    try {
      const userDocRef = doc(firestore_db, "user", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const favoritesArray = userDoc.data().favorites;
        const watchlistArray = userDoc.data().watchlist;
        const friends = userDoc.data().friends;
        const sentFriendRequests = userDoc.data().sentFriendRequests;
        const friendRequests = userDoc.data().friendRequests;
        dispatch(updateFavorites(favoritesArray));
        dispatch(updateWatchlist(watchlistArray));
        dispatch(updateFriends(friends));
        dispatch(updateFriendRequests(friendRequests));
        dispatch(updateSentFriendRequests(sentFriendRequests));
      } else {
        console.log("User document not found");
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  useEffect(() => {
    updateProfile();
  }, []);

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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 5,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 35,
            fontFamily: "HeroBd",
          }}
        >
          HOME
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "#292929", padding: 10, borderRadius: 10 }}
          onPress={() => navigation.navigate("RecommendationNavigator")}
        >
          <Text style={{ color: "white", fontSize: 20, fontFamily: "HeroRg" }}>
            RECOMMEND <FontAwesome5 name="magic" size={15} color="#d24dff" />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 5 }}>
        <Text style={{ color: "#d24dff", fontSize: 20, fontFamily: "HeroRg" }}>
          POPULAR MOVIES
        </Text>
      </View>
      <View
        style={{ width: "100%", alignItems: "center", paddingHorizontal: 5 }}
      >
        {data && (
          <FlatList
            style={{ height: "82%" }}
            ref={scroll}
            data={data.results}
            renderItem={({ item }) => (
              <MovieCard id={item.id} navigation={navigation} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {page != 1 ? (
              <TouchableOpacity
                onPress={() => {
                  setPage((prev) => prev - 1);
                  scroll.current.scrollToOffset({
                    offest: 0,
                    animated: true,
                  });
                }}
              >
                <AntDesign name="arrowleft" size={24} color="#d24dff" />
              </TouchableOpacity>
            ) : null}
            <View
              style={{
                backgroundColor: "#d24dff",
                paddingHorizontal: 10,
                paddingVertical: 0,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                height: "auto",
              }}
            >
              <Text style={{ color: "white", fontSize: 15 }}>{page}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setPage((prev) => prev + 1);
                scroll.current.scrollToOffset({
                  offest: 0,
                  animated: true,
                });
              }}
            >
              <AntDesign name="arrowright" size={24} color="#d24dff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
